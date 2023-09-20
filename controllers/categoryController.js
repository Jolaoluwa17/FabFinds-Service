const Category = require("../models/Category");

// GET all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(404).json({ message: "no categories found" });
    }
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// CREATE new category
const createCategory = async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save();
    return res.status(200).json(savedCategory);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

// GET specific category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// UPDATE category
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedCategory);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// DELETE category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    await category.deleteOne({ _id: req.params.id });
    return res.status(200).json({message: "category has been deleted..."});
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
