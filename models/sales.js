const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  customermail: {
    type: String,
    required: true,
  },
  product: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sales", salesSchema);
