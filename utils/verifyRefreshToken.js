const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyRefreshToken = async (refreshToken) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET;

  try {
    const doc = await User.findOne({ refreshToken: refreshToken });

    if (!doc) {
      throw new Error("Invalid refresh token");
    }

    const tokenDetails = jwt.verify(refreshToken, privateKey);
    return {
      tokenDetails,
      message: "Valid refresh token",
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = { verifyRefreshToken };
