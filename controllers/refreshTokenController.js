const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken");

const newAccessToken = async (req, res) => {
  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5m",
      });
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
};

const handleLogout = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you have access to the user's ID after authentication
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: null } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: false,
        message: "User not found or refresh token not present.",
      });
    }

    res.status(200).json({ error: false, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = { handleLogout, newAccessToken };
