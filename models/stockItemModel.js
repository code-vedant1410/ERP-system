const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    cost: Number,
    isDeleted: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

const StockItem = mongoose.model("StockItem", stockItemSchema);

module.exports = StockItem;
