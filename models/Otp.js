const mongoose = require("mongoose");
const User = require("../models/User");

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

otpSchema.post("save", function (doc) {
  setTimeout(async () => {
    try {
      await Otp.findByIdAndUpdate(doc._id, { expired: true });
    } catch (error) {
      console.error("Error updating OTP expiration:", error);
    }
  }, 2 * 60 * 1000); // 2 minutes in milliseconds
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
