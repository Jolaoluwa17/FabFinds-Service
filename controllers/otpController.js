const Otp = require("../models/Otp");

// Get all otps
const getAllOtps = async (req, res) => {
  try {
    const otps = await Otp.find();

    if (otps.length === 0) {
      return res.status(404).json({ message: "no otps found" });
    }
    return res.status(200).json(otps);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// Get otp according to userId
const getOtpUserId = async (req, res) => {
  try {
    const user = req.params.id;

    // Find the otp by user id in the database
    const otp = await Otp.findOne({ user });
    if (!otp) {
      return res.status(404).json({ message: "otp not found" });
    }
    return res.status(200).json(otp);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { getAllOtps, getOtpUserId };
