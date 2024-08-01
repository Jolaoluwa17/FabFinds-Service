/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the collection (unique)
 *         description:
 *           type: string
 *           description: Description of the collection
 *         products:
 *           type: array
 *           items:
 *             type: string
 *             description: The IDs of the products in this collection
 *       example:
 *         name: Summer Collection
 *         description: New arrivals for summer fashion
 */
const Collection = require("../models/Collection");

/**
 * @swagger
 * /collection:
 *   get:
 *     summary: Get all collections
 *     tags: [Collection]
 *     responses:
 *       200:
 *         description: A list of collections
 *       404:
 *         description: No collections found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /collection:
 *   post:
 *     summary: Create a new collection
 *     tags: [Collection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       201:
 *         description: Collection created successfully
 *       500:
 *         description: Server error
 */
// CREATE new collection
const createCollection = async (req, res) => {
  const newCollection = new Collection(req.body);
  try {
    const savedCollection = await newCollection.save();
    return res.status(201).json(savedCollection);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

/**
 * @swagger
 * /collection/{id}:
 *   get:
 *     summary: Get a specific collection by ID
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The collection ID
 *     responses:
 *       200:
 *         description: The collection data
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /collection/{id}:
 *   put:
 *     summary: Update a collection by ID
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       200:
 *         description: Collection updated successfully
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
// UPDATE collection
const updateCollection = async (req, res) => {
  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // Added runValidators to ensure the data is valid
    );
    if (!updatedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    return res.status(200).json(updatedCollection);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * @swagger
 * /collection/{id}:
 *   delete:
 *     summary: Delete a collection by ID
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The collection ID
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
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
