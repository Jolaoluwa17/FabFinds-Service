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
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 120, // Set the expiration time in seconds (10 seconds in this case)
    },
  },
  { timestamps: true }
);

otpSchema.pre("save", async function (next) {
  if (this.isModified("otp") && this.otp === null) {
    try {
      // Find the corresponding user document by _id and update the `otp` field to null
      await User.findByIdAndUpdate(this.user, { $set: { otp: null } });
    } catch (error) {
      console.error("Error updating user's OTP:", error);
    }
  }
  next();
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
