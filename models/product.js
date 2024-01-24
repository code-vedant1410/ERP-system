const mongoose = require("mongoose");
const { image } = require("pdfkit");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true },
  image: { type: image },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
