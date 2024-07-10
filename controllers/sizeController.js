const mongoose = require("mongoose");
const Size = require("../models/Size");

const createSize = async (req, res) => {
  try {
    const newSize = new Size(req.body); 
    const savedSize = await newSize.save(); 
    res.status(201).json(savedSize); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSizeById = async (req, res) => {
  const { id } = req.params;

  try {
    const size = await Size.findById(id);
    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json(size);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSize = async (req, res) => {
  const { id } = req.params;
  const { sizeName } = req.body;

  try {
    const updatedSize = await Size.findByIdAndUpdate(
      id,
      { sizeName },
      { new: true }
    );
    if (!updatedSize) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json(updatedSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSize = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSize = await Size.findByIdAndDelete(id);
    if (!deletedSize) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.json({ message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize,
};
