const User = require("../models/User");
const { Novu } = require("@novu/node");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const novuRoot = new Novu(process.env.NOVU_API_KEY);

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp) {
      // Clear user's otp field
      user.otp = null;
      await user.save();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const encryptedOtp = await bcrypt.hash(otp, saltRounds);

    user.otp = encryptedOtp;
    await user.save();

    await novuRoot.trigger("password-reset", {
      to: {
        subscriberId: user._id,
        email: user.email,
      },
      payload: {
        name: user.name,
        OTP: otp,
      },
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and newPassword are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided OTP with the stored hashed OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await novuRoot.trigger("password-change-successfull", {
      to: {
        subscriberId: user._id,
        email: user.email,
      },
      payload: {
        name: user.name,
      },
    });

    // Now update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendOtp, verifyOtp };
