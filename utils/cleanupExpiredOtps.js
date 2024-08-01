const cron = require('node-cron');
const Otp = require('../models/Otp');
const User = require('../models/User');

const cleanupExpiredOtps = () => {
  // Schedule a cron job to run every minute
  cron.schedule('* * * * *', async () => {
    try {
      // Find expired OTPs where expired field is true
      const expiredOtps = await Otp.find({
        expired: true,
      });

      for (const otp of expiredOtps) {
        // Update the user's otp field to null
        await User.findByIdAndUpdate(otp.user, { otp: null });
        // Remove the expired OTP
        await Otp.findByIdAndDelete(otp._id);
      }
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  });
};

module.exports = cleanupExpiredOtps;
