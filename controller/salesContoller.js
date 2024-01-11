const Sales = require("../models/sales");
const Product = require("../models/product");
const successResponse = require("../responses/successResponse");
const errorResponse = require("../responses/errorResponse");
const salesController = {
  createSale: async (req, res) => {
    try {
      const { product: productId, quantity, price } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
        return errorResponse(res, 404, "Product not found");
      }
      if (product.inventory < quantity) {
        return errorResponse(res, 400, "Insufficient inventory");
      }
      product.inventory -= quantity;
      await product.save();

      const newSale = new Sales({ product: productId, quantity, price });
      const savedSale = await newSale.save();

      successResponse(res, savedSale, "Sale created successfully");
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },
  getSales: async (req, res) => {
    try {
      const sales = await Sales.find().populate("product");
      successResponse(res, sales, "Sales retrieved successfully");
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, "Internal Server Error", error);
    }
  },
};
module.exports = salesController;
