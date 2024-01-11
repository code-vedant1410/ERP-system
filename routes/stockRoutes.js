const express = require("express");
const router = express.Router();
const StockItem = require("../models/stockItemModel");

// Get all stock items
router.get("/", async (req, res) => {
  try {
    const stockItems = await StockItem.find({ isDeleted: false });
    res.json(stockItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new stock item
router.post("/", async (req, res) => {
  const stockItem = new StockItem({
    name: req.body.name,
    quantity: req.body.quantity,
    cost: req.body.cost,
  });

  try {
    const newStockItem = await stockItem.save();
    res.status(201).json(newStockItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a stock item's quantity
router.patch("/:id", async (req, res) => {
  try {
    const stockItem = await StockItem.findById(req.params.id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    stockItem.quantity = req.body.quantity;

    const updatedStockItem = await stockItem.save();
    res.json(updatedStockItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a stock item
router.delete("/:id", async (req, res) => {
  try {
    const stockItem = await StockItem.findById(req.params.id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    await stockItem.remove();
    res.json({ message: "Stock item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
