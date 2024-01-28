const Product = require("../models/product");
const successResponse = require("../responses/successResponse");
const errorResponse = require("../responses/errorResponse");
const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, inventory } = req.body;
      const newProduct = new Product({ name, price, inventory });
      const savedProduct = await newProduct.save();
      successResponse(res, savedProduct, "Product created successfully");
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
            // You can add more fields as needed
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
      ])
      successResponse(res, products, "Products retrieved successfully");
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },
};
module.exports = productController;
