const Otp = require("../models/Otp");
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const encryptedOtp = await bcrypt.hash(otp, saltRounds);

    const newOtp = new Otp({
      user: user._id,
      otp: encryptedOtp,
    });
    const savedOtp = await newOtp.save();

    user.otp = savedOtp._id;
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
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the OTP for the user
    const foundOtp = await Otp.findOne({ user: user._id });
    if (!foundOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (foundOtp.expired) {
      // Update the user's otp field to null and delete the expired OTP
      await User.findByIdAndUpdate(user._id, { otp: null });
      await Otp.findByIdAndDelete(foundOtp._id);
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Compare the provided OTP with the stored hashed OTP
    const isMatch = await bcrypt.compare(otp, foundOtp.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed with desired action
    // For example, mark OTP as used by deleting it and clearing it from user
    await Otp.findByIdAndDelete(foundOtp._id);
    user.otp = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendOtp, verifyOtp };
