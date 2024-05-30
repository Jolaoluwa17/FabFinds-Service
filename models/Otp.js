const mongoose = require("mongoose");
const User = require("../models/User");

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
  },
  { timestamps: true }
);


const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
