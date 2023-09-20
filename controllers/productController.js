const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
const ProductImg = require("../models/ProductImg");
const multer = require("../utils/multer");

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("productImg");
    if (products.length === 0) {
      return res.status(404).json({ message: "no products found" });
    }
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// CREATE new products
const createNewProduct = async (req, res) => {
  try {
    // Use multer to upload the image
    multer.upload.single("ProductImg")(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "File upload error", error: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload image to Cloudinary
      const result = await cloudinary.cloudinary.uploader.upload(
        req.file.path,
        { folder: "Product" }
      );

      // Create a new ProductImg document with image details
      const productImg = new ProductImg({
        fileUrl: result.secure_url,
        fileType: result.format,
        fileName: result.original_filename,
        public_id: result.public_id,
      });

      // Save the ProductImg document
      await productImg.save();

      // Create a new product with a reference to the ProductImg document
      const product = await Product.create({
        ...req.body,
        productImg: productImg._id, // This links the product to the uploaded image
      });

      return res.status(201).json({
        message: "Product created successfully",
        product: product,
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// GET specific product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "productImg"
    );

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// UPDATE specific product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    return res.status(200).json({
      message: "product updated successfully",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

// DELETE specific product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has an associated product image
    if (product && product.productImg) {
      const productImg = await ProductImg.findById(product.productImg);

      if (productImg) {
        // Delete the product image from Cloudinary
        await cloudinary.cloudinary.uploader.destroy(productImg.public_id);

        // Delete the product image document
        await productImg.deleteOne({ _id: product.productImg });
      }
    }

    // Delete the product document
    await product.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

module.exports = {
  getAllProducts,
  createNewProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
