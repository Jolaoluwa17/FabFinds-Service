const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ROLES_LIST = require("../config/roles_list");
const { Novu } = require("@novu/node");
const novuRoot = new Novu(process.env.NOVU_API_KEY);
const saltRounds = 10;

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
        id: user._id,
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

  const roles = Object.values(user.roles);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: user.name,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    { name: user.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  //Saving refreshToken with current user
  user.refreshToken = refreshToken;
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

/**
 * @swagger
 * /auth/refreshToken:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token to generate a new access token
 *     responses:
 *       200:
 *         description: Successful token refresh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Invalid or expired token
 */
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

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       204:
 *         description: No content - Tokens already cleared
 *       404:
 *         description: User not found
 */
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

  // Delete refreshToken in db
  foundUser.refreshToken = null;
  await foundUser.save();
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

/**
 * @swagger
 * /auth/forgot-password/send-otp:
 *   post:
 *     summary: Send an OTP to the user's email for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
// Forgot password
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp) {
      // Clear user's otp field
      user.otp = null;
      await user.save();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const encryptedOtp = await bcrypt.hash(otp, saltRounds);

    user.otp = encryptedOtp;
    await user.save();

    await novuRoot.trigger("password-reset", {
      to: {
        subscriberId: user._id,
        email: user.email,
      },
      payload: {
        name: user.name,
        OTP: otp,
      },
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /auth/forgot-password/verify-otp:
 *   post:
 *     summary: Verify OTP and reset the user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Email, OTP, and newPassword are required or Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields:
 *                       value: "Email, OTP, and newPassword are required"
 *                     invalid_otp:
 *                       value: "Invalid OTP"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and newPassword are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided OTP with the stored hashed OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await novuRoot.trigger("password-change-successfull", {
      to: {
        subscriberId: user._id,
        email: user.email,
      },
      payload: {
        name: user.name,
      },
    });

    // Now update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.accountDisabled = false
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleUserLogin,
  handleAdminLogin,
  handleNewUser,
  handleNewAdmin,
  handleRefreshToken,
  handleLogout,
  sendOtp,
  verifyOtp,
};
