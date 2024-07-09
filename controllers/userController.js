const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Novu } = require("@novu/node");
const novuRoot = new Novu(process.env.NOVU_API_KEY);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get logged-in user information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the logged-in user
 *       404:
 *         description: User not found
 */
// GET user when logged in
const getLoggedInUser = (req, res) => {
  if (!req?.user) {
    return res.status(404).json({ message: "User not found" });
  }
  const username = req.user;
  return res.status(200).json({ username: username });
};

/**
 * @swagger
 * /user/send-verify-email:
 *   post:
 *     summary: Send verification email to the user
 *     tags: [User]
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
 *         description: Verification OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification OTP sent successfully
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: User is already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is already verified
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 */
// verify user email
const sendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified === true) {
      return res.status(401).json({ message: "User is already verified" });
    }

    if (user.otp !== "") {
      await User.findByIdAndUpdate(user._id, {
        otp: null,
      });
    }
    // Generate a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Encrypt the OTP using bcrypt
    const encryptedOtp = await bcrypt.hash(otp, 10); // Adjust salt rounds as needed

    // Save encrypted OTP to user's verifiedOtp field
    user.otp = encryptedOtp;
    await user.save();

    // Send the OTP via email
    await novuRoot.trigger("verify-account", {
      to: {
        subscriberId: user._id,
        email: user.email,
      },
      payload: {
        name: user.name,
        OTP: otp,
      },
    });

    res.status(200).json({ message: "Verification OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
};

/**
 * @swagger
 * /user/verify-account:
 *   post:
 *     summary: Verify user email with OTP
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *       400:
 *         description: Email and OTP are required or Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     emailOtpRequired:
 *                       value: Email and OTP are required
 *                     invalidOtp:
 *                       value: Invalid OTP
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
// verify email address
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided OTP with the stored encrypted OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verification successful, handle further actions (e.g., mark user as verified)
    // For example, you can set user.isVerified = true and clear user.verifiedOtp
    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNo:
 *                     type: string
 *                   isVerified:
 *                     type: boolean
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: no users found
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: an error occurred
 *                 error:
 *                   type: string
 */
// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "no users found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roles:
 *                   type: object
 *                 isVerified:
 *                   type: boolean
 *                 phoneNo:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// GET specific user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: body
 *         name: body
 *         description: The user object to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             roles:
 *               type: object
 *             isVerified:
 *               type: boolean
 *             phoneNo:
 *               type: string
 *     responses:
 *       200:
 *         description: User data has been updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roles:
 *                       type: object
 *                     isVerified:
 *                       type: boolean
 *                     phoneNo:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
// UPDATE user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "user data has been updated", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User has been deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "user has been deleted..."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "an error occurred"
 *                 error:
 *                   type: string
 */
// DELETE user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    await user.deleteOne({ _id: req.params.id });
    return res.status(200).json("user has been deleted...");
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getLoggedInUser,
  sendVerifyEmail,
  verifyEmail,
};
