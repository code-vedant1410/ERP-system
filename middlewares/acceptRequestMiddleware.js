const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { errorResponse } = require("../repositories/userRepository");

const acceptRequestMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("6", token);
  if (!token) {
    return errorResponse(res, 401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, 401, "Unauthorized: User not found");
    }

    const newToken = jwt.sign(
      { _id: user._id, username: user.username },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    res.setHeader("newToken", newToken);

    req.user = user;

    next();
  } catch (err) {
    return errorResponse(res, 401, "Unauthorized: Invalid token");
  }
};

module.exports = acceptRequestMiddleware;
