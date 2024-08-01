const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
const ProductImg = require("../models/ProductImg");
const multer = require("../utils/multer");
const maxImages = 5;

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
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
 *                   description:
 *                     type: string
 *                   price:
 *                     type: string
 *                   stockQty:
 *                     type: boolean
 *                   productImg:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: no products found
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
// GET all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("productImg")
      .populate("sizes")
      .populate("colors");
    if (products.length === 0) {
      return res.status(404).json({ message: "no products found" });
    }
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stockQty
 *               - productImg
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stockQty:
 *                 type: number
 *               productImg:
 *                 type: array
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: File upload error
 */

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

      try {
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
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error processing images", error: error });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A product object
 *       404:
 *         description: product not found
 *       500:
 *         description: Internal server error
 */
// GET specific product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "productImg",
    );

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "an error occurred", error: err });
  }
};

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a specific product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               productImg:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request, such as file upload error or maximum number of images reached
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
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
          { new: true },
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

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product has been deleted
 *       404:
 *         description: product not found
 *       500:
 *         description: Internal server error
 */
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
