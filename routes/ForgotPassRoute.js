const express = require("express");
const router = express.Router();
const forgotPassController= require("../controller/forgotPassController");

router.post("/forgot-password", forgotPassController.forgotPassword);

module.exports = router;
