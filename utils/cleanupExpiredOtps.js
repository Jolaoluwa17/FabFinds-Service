const cron = require("node-cron");
const Otp = require("../models/Otp");
const User = require("../models/User");

const cleanupExpiredOtps = () => {
  // Schedule a cron job to run every minute
  cron.schedule("* * * * *", async () => {
    try {
      // Find expired OTPs (older than 2 minutes)
      const expiredOtps = await Otp.find({
        createdAt: { $lt: new Date(Date.now() - 2 * 60 * 1000) },
      });

      for (const otp of expiredOtps) {
        // Update the user's otp field to null
        await User.findByIdAndUpdate(otp.user, { otp: null });
        // Remove the expired OTP
        await Otp.findByIdAndDelete(otp._id);
      }
    } catch (error) {
      console.error("Error cleaning up expired OTPs:", error);
    }
  });
};

module.exports = cleanupExpiredOtps;
