const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
router.post("/createproduct", productController.createProduct);
router.get("/getproducts", productController.getProducts);
module.exports = router;
