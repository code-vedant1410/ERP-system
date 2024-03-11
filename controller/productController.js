const multer = require("multer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { Product, getProductById, ProductImage } = require("../models/product");
const successResponse = require("../responses/successResponse");
const errorResponse = require("../responses/errorResponse");
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
      const { name, price, inventory, category } = req.body;

      if (!req.file) {
        return errorResponse(res, 400, "Image file is required");
      }

      const image = req.file;

      const imageUrl = `/Users/vedantbhatt/Downloads/${image.filename}`;

      const newProductImage = new ProductImage({
        imageUrl: imageUrl,
        productId: null,
      });

      const savedProductImage = await newProductImage.save();

      const newProduct = new Product({
        name,
        price,
        inventory,
        category,
        image: savedProductImage._id,
      });

      const savedProduct = await newProduct.save();
      savedProductImage.productId = savedProduct._id;
      await savedProductImage.save();

      successResponse(
        res,
        { product: savedProduct, image: savedProductImage },
        "Product created successfully"
      );
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },
 
  getProducts: async (req, res) => {
    try {
      const products = await Product.find(); // Changed to use Product model function

      successResponse(res, products, "Products retrieved successfully");
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
 
    }
  },
  getProductsByCategory: async (req, res) => {
    try {
      const category = req.params.category; // Extract category from request
      const products = await Product.find({ category }); // Filter products by category
      
      // Check if no products were found for the provided category
      if (products.length === 0) {
        return errorResponse(res, 404, `No products found in category '${category}'`);
      }
  
      // If products are found, return them in the response
      successResponse(
        res,
        products,
        `Products in category '${category}' retrieved successfully`
      );
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },

  getProductDetails: async (req, res) => {
    try {
      const productId = req.params.id;
      console.log("test", productId);
      const productDetails = await Product.aggregate([
        {
          $match: { _id: new ObjectId(productId) },
        },
        {
          $lookup: {
            from: "productimages",
            localField: "_id",
            foreignField: "productId",
            as: "images",
          },
        },
      ]);

      if (productDetails.length === 0) {
        return errorResponse(res, 404, "Product not found");
      }
      successResponse(
        res,
        productDetails[0],
        "Product details retrieved successfully"
      );
    }
    
    catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },
};

module.exports = { upload, ...productController };
