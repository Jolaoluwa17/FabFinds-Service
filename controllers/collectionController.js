const Collection = require("../models/Collection");

// GET all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    if (collections.length === 0) {
      return res.status(404).json({ message: "no collections found" });
    }
    return res.status(200).json(collections);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// CREATE new collection
const createCollection = async (req, res) => {
  const newCollection = new Collection(req.body);
  try {
    const savedCollection = await newCollection.save();
    return res.status(200).json(savedCollection);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

// GET specific collection
const getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "collection not found" });
    }
    return res.status(200).json(collection);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// UPDATE collection
const updateCollection = async (req, res) => {
  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedCollection);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// DELETE collection
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "collection not found" });
    }
    await collection.deleteOne({ _id: req.params.id });
    return res.status(200).json("collection has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllCollections,
  getCollection,
  createCollection,
  deleteCollection,
  updateCollection,
};
