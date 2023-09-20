const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 120, // Set the expiration time in seconds (10 seconds in this case)
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
