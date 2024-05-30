const Otp = require("../models/Otp");
const User = require("../models/User");
const { Novu } = require("@novu/node");
const novuRoot = new Novu(process.env.NOVU_API_KEY);

const sendOtp = async (req, res) => {
  const { email } = req.body; // Assuming email is sent in the request body

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP (this is a placeholder, implement your OTP generation logic)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database (assuming you save OTP in your database)
    const newOtp = new Otp({ user: user._id, otp, createdAt: new Date() });
    const savedOtp = await newOtp.save();

    // Update the user's otp field
    user.otp = savedOtp._id;
    await user.save();

    // Send OTP using Novu
    await novuRoot.trigger("password-reset", {
      to: {
        subscriberId: user._id, // Assuming user._id is the unique identifier
        email: user.email,
      },
      payload: {
        name: user.name, // Use name if available, otherwise email
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
    const foundOtp = await Otp.findOne({ user: user._id, otp });
    if (!foundOtp) {
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
