const Product = require("../models/product");
const successResponse = require("../responses/successResponse");
const errorResponse = require("../responses/errorResponse");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, inventory } = req.body;

      if (!req.file) {
        return errorResponse(res, 400, "Image file is required");
      }

      const image = req.file;

      const imageUrl = `/Users/vedantbhatt/Downloads${image.filename}`;

      const newProduct = new Product({
        name,
        price,
        inventory,
        image: imageUrl,
      });
      const savedProduct = await newProduct.save();

      successResponse(res, savedProduct, "Product created successfully");
      return savedProduct._id;
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Product.aggregate([
        {
          $addFields: {
            newStringField: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "files",
            localField: "newStringField",
            foreignField: "productId",
            as: "result",
          },
        },
      ]);
      successResponse(res, products, "Products retrieved successfully");
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },

  addImageToProduct: async (productId, imageUrl) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: { image: imageUrl } },
        { new: true }
      );

      if (!updatedProduct) {
        console.error("Product not found");
        return null;
      }

      console.log("Product with Image:", updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error("Error adding image to product:", error.message);
      throw error;
    }
  },
};

module.exports = { upload, ...productController };
