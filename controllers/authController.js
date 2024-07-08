const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ROLES_LIST = require("../config/roles_list");
const { Novu } = require("@novu/node");
const novuRoot = new Novu(process.env.NOVU_API_KEY);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration
 */

/**
 * @swagger
 * /auth/user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phoneNo
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */
const handleNewUser = async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  // to check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email, name }],
  });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User already exists", status: 409 });
  }

  try {
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password is required and must be a string" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create a new user
    const newUser = new User({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      roles: { User: ROLES_LIST.User },
      otp: null,
      accessToken: null,
    });

    // save user to the database
    const savedUser = await newUser.save();

    // Generate a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Encrypt the OTP using bcrypt
    const encryptedOtp = await bcrypt.hash(otp, 10);

    // Save encrypted OTP to user's verifiedOtp field
    savedUser.otp = encryptedOtp;
    await savedUser.save();

    // send OTP to the user's email
    await novuRoot.trigger("verify-account", {
      to: {
        subscriberId: savedUser._id,
        email: savedUser.email,
      },
      payload: {
        name: savedUser.name,
        OTP: otp,
      },
    });

    res.status(201).json({ user: savedUser, message: "Sign-up completed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

/**
 * @swagger
 * /auth/admin/signup:
 *   post:
 *     summary: Create a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - phoneNo
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */
const handleNewAdmin = async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  // to check if user already exists
  const existingAdmin = await User.findOne({
    $or: [{ email, name }],
  });
  if (existingAdmin) {
    return res
      .status(409)
      .json({ message: "Admin already exists", status: 409 });
  }

  try {
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password is required and must be a string" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create a new user
    const newAdmin = new User({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      roles: { User: ROLES_LIST.User, Admin: ROLES_LIST.Admin },
      otp: null,
      refreshToken: null,
    });

    // save admin to the database
    const savedAdmin = await newAdmin.save();
    res.status(201).json({ admin: savedAdmin, message: "Sign-up completed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error", error: error });
  }
};

/**
 * @swagger
 * /auth/user/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       403:
 *         description: Account disabled
 */
const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the account is disabled
  if (user.accountDisabled) {
    return res.status(403).json({
      message:
        "Account is disabled due to multiple failed login attempts. Please contact support or verify your OTP.",
    });
  }

  // Comparing the provided password with the stored hashed password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    // Increment the failedLogin counter
    user.failedLogin += 1;

    // Check if failedLogin has reached 5
    if (user.failedLogin >= 5) {
      user.accountDisabled = true;
    }

    await user.save();

    return res.status(401).json({ message: "Incorrect password" });
  }

  user.failedLogin = 0;
  await user.save();

  if (!user.isVerified) {
    return res.status(401).json({ message: "User not verified" });
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
      expiresIn: "2m",
    }
  );

  const maxAge = 2 * 60;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: maxAge * 1000,
    sameSite: "none",
    secure: true,
    partitioned: true,
  });

  res.status(201).json({
    message: "Login successful",
    accessToken: accessToken,
  });
};

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
const handleAdminLogin = async (req, res) => {
  const foundUser = await User.findOne({ email: req.body.email });

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const roles = Object.values(foundUser.roles);
  // console.log(roles);

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
  await foundUser.save();

  //Saving refresh tokens with current users
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
    partitioned: true,
  });

  const maxAge = 2 * 60;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: maxAge * 1000,
    sameSite: "none",
    secure: true,
    partitioned: true,
  });

  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    return res.sendStatus(403);
  } // Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.name !== decoded.name) return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          name: decoded.name,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const maxAge = 2 * 60;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "None",
      secure: true,
      partitioned: true,
    });
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  });
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;

  if (cookies.accessToken !== "") {
    res.clearCookie("accessToken", {
      httpOnly: true,
      maxAge: 2 * 60 * 1000,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    return res.sendStatus(204);
  }
  if (cookies.refreshToken === "") {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.refreshToken;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      maxAge: 2 * 60 * 1000,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = null;
  const result = await foundUser.save();
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 2 * 60 * 1000,
    partitioned: true,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    partitioned: true,
  });

  //secure: true - only serves on https
  res.sendStatus(200);
};

module.exports = {
  handleUserLogin,
  handleAdminLogin,
  handleNewUser,
  handleNewAdmin,
  handleRefreshToken,
  handleLogout,
};
