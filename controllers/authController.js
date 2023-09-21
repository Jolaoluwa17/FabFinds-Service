const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleUserLogin = async (req, res) => {
  const { name, email, password, phoneNo } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Comparing the provided password with the stored hashed password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const roles = Object.values(user.roles).filter(Boolean);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: user.name,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );


  res.status(201).json({
    message: "Login successful",
    accessToken: accessToken,
    user: user,
  });
};

module.exports = { handleUserLogin };
