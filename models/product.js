const mongoose = require("mongoose");
const { image } = require("pdfkit");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    image: {
      type: String, // Assuming you store image URLs
      default: 'default-image.jpg', // Default image if not provided
    },
  },
  {
    versionKey: false,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
