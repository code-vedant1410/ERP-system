const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const upload=productController.upload;
router.post('/createProduct', upload.single('image'), productController.createProduct);
router.get("/getproducts", productController.getProducts);
module.exports = router;
