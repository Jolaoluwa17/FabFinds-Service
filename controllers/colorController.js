const Color = require('../models/Color');

// Create a new color
const createColor = async (req, res) => {
  try {
    const newColor = new Color(req.body);
    const savedColor = await newColor.save();
    res.status(201).json(savedColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all colors
const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a color by ID
const getColorById = async (req, res) => {
  const { id } = req.params;

  try {
    const color = await Color.findById(id);
    if (!color) {
      return res.status(404).json({ message: 'Color not found' });
    }
    res.json(color);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a color
const updateColor = async (req, res) => {
  const { id } = req.params;
  const { colorName } = req.body;

  try {
    const updatedColor = await Color.findByIdAndUpdate(
      id,
      { colorName },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: 'Color not found' });
    }
    res.json(updatedColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a color
const deleteColor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    if (!deletedColor) {
      return res.status(404).json({ message: 'Color not found' });
    }
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColor,
};
