const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { upload } = productController;
const acceptRequestMiddleware = require("../middlewares/acceptRequestMiddleware");

router.post(
  "/createProduct",
  upload.single("image"),
  productController.createProduct
);
router.get("/getproducts", productController.getProducts);
router.get("/product/:id", productController.getProductDetails);
router.get(
  "/open/:id",
  acceptRequestMiddleware,
  productController.getProductDetails
);

module.exports = router;
