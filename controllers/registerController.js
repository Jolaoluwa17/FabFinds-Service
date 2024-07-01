const User = require("../models/User");
const bcrypt = require("bcryptjs");
const ROLES_LIST = require("../config/roles_list");
const { Novu } = require("@novu/node");
const novuRoot = new Novu(process.env.NOVU_API_KEY);

const handleNewUser = async (req, res) => {
  const { name, email, phoneNo, password, roles } = req.body;

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

module.exports = { handleNewUser, handleNewAdmin };
