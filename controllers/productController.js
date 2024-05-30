const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
const ProductImg = require("../models/ProductImg");
const multer = require("../utils/multer");
const maxImages = 5;

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
    // Use multer to upload the images
    multer.upload.array("productImg", maxImages)(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ message: "File upload error", error: err });
        } else {
          return res
            .status(500)
            .json({ message: "File upload error", error: err });
        }
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Array to store the references to the uploaded images
      const productImgIds = [];

      // Upload each image to Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.main.uploader.upload(file.path, {
          folder: "/Product",
        });

        // Create a new ProductImg document with image details
        const productImg = new ProductImg({
          fileUrl: result.secure_url,
          fileType: result.format,
          fileName: result.original_filename,
          public_id: result.public_id,
        });

        // Save the ProductImg document and store its ID
        const savedImg = await productImg.save();
        productImgIds.push(savedImg._id);
      }

      // Create a new product with references to the ProductImg documents
      const product = await Product.create({
        ...req.body,
        productImg: productImgIds, // This links the product to the uploaded images
      });

      return res.status(201).json({
        message: "Product created successfully",
        product: product,
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
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
    // Find the existing product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate the number of additional pictures that can be added
    const remainingSlots = maxImages - product.productImg.length;

    if (remainingSlots === 0) {
      return res
        .status(400)
        .json({ message: "Maximum number of images reached" });
    }

    // Create a multer middleware to handle the file upload
    const newUpload = multer.upload.array("productImg", maxImages);

    // Use the multer middleware
    newUpload(req, res, async (err) => {
      try {
        if (err) {
          if (err instanceof multer.MulterError) {
            return res
              .status(400)
              .json({ message: "File upload error", error: err });
          } else {
            return res
              .status(500)
              .json({ message: "File upload error", error: err });
          }
        }

        // Check if the number of files uploaded exceeds the remaining slots
        if (req.files && req.files.length > remainingSlots) {
          return res.status(400).json({
            message: `You can upload up to ${remainingSlots} more image(s)`,
          });
        }

        // Array to hold new image IDs
        const newProductImgIds = [];

        // Check if files were uploaded
        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            const result = await cloudinary.main.uploader.upload(file.path, {
              folder: "/Product",
            });

            const newProductImg = new ProductImg({
              fileUrl: result.secure_url,
              fileType: result.format,
              fileName: result.original_filename,
              public_id: result.public_id,
            });

            const savedImg = await newProductImg.save();
            newProductImgIds.push(savedImg._id);
          }

          product.productImg.push(...newProductImgIds);
        }

        // Prepare the update data
        const updateData = { ...req.body };
        if (newProductImgIds.length > 0) {
          updateData.productImg = product.productImg;
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

        return res.status(200).json({
          message: "Product updated successfully",
          product: updatedProduct,
        });
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "An error occurred", error: err });
      }
    });
  } catch (err) {
    console.error("An error occurred:", err);
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// DELETE specific product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has associated product images
    if (product.productImg && product.productImg.length > 0) {
      // Iterate through each image associated with the product
      for (const imgId of product.productImg) {
        const productImg = await ProductImg.findById(imgId);

        if (productImg) {
          // Delete the product image from Cloudinary
          await cloudinary.main.uploader.destroy(productImg.public_id);

          // Delete the product image document
          await productImg.deleteOne({ _id: imgId });
        }
      }
    }

    // Delete the product document
    await product.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

module.exports = {
  getAllProducts,
  createNewProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
