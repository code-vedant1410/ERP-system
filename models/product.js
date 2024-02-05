const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    image: {
      type: String, 
      default: 'default-image.jpg', 
    },
  },
  {
    versionKey: false,
  }
);

const Product = mongoose.model("Product", productSchema);

const productFunctions = {
  getProducts: () => products,
  getProductById: (productId) => products.find(product => product.id === productId),
};

module.exports = { Product, ...productFunctions };
