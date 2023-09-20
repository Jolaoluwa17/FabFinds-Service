const Otp = require("../models/Otp");
const User = require("../models/User");
const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const emailController = require("../utils/emailTemplate");

const CLIENT_ID = process.env.GOOGLE_API_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_API_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_API_REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;

const MY_EMAIL = "olusanyajolaoluwa17@gmail.com";
// const to = "olusanyaemmanuel78@gmail.com";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else if (user && user.email) {
      const to = user.email;
      const userName = user.name;
      const userId = user._id;
      // console.log(to, userName);
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      const newOtp = new Otp({
        otp: generatedOtp,
        user: userId,
      });
      const savedOtp = await newOtp.save();
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { otp: savedOtp._id } },
        { new: true }
      );
      const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
      const transport = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: MY_EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });
      //EMAIL OPTIONS
      const from = MY_EMAIL;
      const subject = "Password Reset";
      const html = emailController.emailTemplate(generatedOtp, userName);
      return new Promise((resolve, reject) => {
        transport.sendMail({ from, subject, to, html }, (err, info) => {
          if (err) reject(err);
          resolve(info);
        });
        res.status(200).json({
          message: "Email sent successfully",
          otp: savedOtp,
          updatedUser: updatedUser,
        });
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { sendOtp };
