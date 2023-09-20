const User = require("../models/User");

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

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
