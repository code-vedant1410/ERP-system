const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true }
});

const productImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
});

const Product = mongoose.model("Product", productSchema);
const ProductImage = mongoose.model("ProductImage", productImageSchema);

module.exports = { Product, ProductImage };
