const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ROLES_LIST = require("../config/roles_list");

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
  // console.log(roles);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: user.name,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2m",
    }
  );

  const maxAge = 2 * 60;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: maxAge * 1000,
    sameSite: "None",
    secure: true,
  });

  res.status(201).json({
    message: "Login successful",
    accessToken: accessToken,
    user: user,
  });
};

const handleAdminLogin = async (req, res) => {
  const foundUser = await User.findOne({ email: req.body.email });

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const roles = Object.values(foundUser.roles);
  console.log(roles);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: foundUser.name,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    { name: foundUser.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  //Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();

  //Saving refresh tokens with current users
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });

  const maxAge = 2 * 60;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: maxAge * 1000,
    sameSite: "None",
    secure: true,
  });

  res.json({ accessToken });
};

module.exports = { handleUserLogin, handleAdminLogin };
