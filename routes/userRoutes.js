const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authenticateToken = require("../middlewares/authenticationMiddleware");


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put('/profile',userController.updateUserProfile);

module.exports = router;
