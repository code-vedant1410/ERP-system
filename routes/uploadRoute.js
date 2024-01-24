const express = require("express");
const router = express.Router();
const uploads = require("../controller/uploadController");
router.post("/image", uploads);
module.exports = router;
