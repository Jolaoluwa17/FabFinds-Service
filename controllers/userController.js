const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Novu } = require("@novu/node");
const novuRoot = new Novu(process.env.NOVU_API_KEY);

// GET user when logged in
const getLoggedInUser = (req, res) => {
  if (!req?.user) {
    return res.status(404).json({ message: "User not found" });
  }
  const username = req.user;
  return res.status(200).json({ username: username });
};

// verify user email
const sendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified === true) {
      return res.status(401).json({ message: "User is already verified" });
    }

    if (user.otp !== "") {
      await User.findByIdAndUpdate(user._id, {
        otp: null,
      });
    }
    // Generate a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Encrypt the OTP using bcrypt
    const encryptedOtp = await bcrypt.hash(otp, 10); // Adjust salt rounds as needed

    // Save encrypted OTP to user's verifiedOtp field
    user.otp = encryptedOtp;
    await user.save();

    // Send the OTP via email
    await novuRoot.trigger("verify-account", {
      to: {
        subscriberId: user._id,
        email: user.email,
      },
      payload: {
        name: user.name,
        OTP: otp,
      },
    });

    res.status(200).json({ message: "Verification OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
};

// verify email address
const verifyEmail = async (req, res) => {
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

    // Compare the provided OTP with the stored encrypted OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verification successful, handle further actions (e.g., mark user as verified)
    // For example, you can set user.isVerified = true and clear user.verifiedOtp
    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "no users found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// GET specific user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "user data has been updated", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    await user.deleteOne({ _id: req.params.id });
    return res.status(200).json("user has been deleted...");
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getLoggedInUser,
  sendVerifyEmail,
  verifyEmail,
};
