const ProductImg = require("../models/ProductImg");
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// DELETE specific image by ID
const deleteImageById = async (req, res) => {
  try {
    // Find the image document
    const productImg = await ProductImg.findById(req.params.id);
    if (!productImg) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Find the product that contains this image
    const product = await Product.findOne({ productImg: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the image reference from the product's productImg array
    product.productImg.pull(req.params.id);
    await product.save();

    // Destroy the image from Cloudinary
    await cloudinary.main.uploader.destroy(productImg.public_id);

    // Delete the image document
    await productImg.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

module.exports = {
  deleteImageById,
};
