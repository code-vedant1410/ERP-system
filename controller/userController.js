const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userRepo = require("../repositories/userRepository");
const config = require("../config/config");

const userController = {
  registerUser: async (req, res) => {
    try {
      const { username, password, role, gender, email, mobile } = req.body;

      // Check if the username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }, { mobile }],
      });
      if (existingUser) {
        return userRepo.errorResponse(
          res,
          400,
          "Username or email or mobile number already exists"
        );
      }

      // Hash the password
      const hashedPassword = await argon2.hash(password);

      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
        role,
        mobile,
        email,
        gender,
      });

      // Save the user to the database
      const savedUser = await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: savedUser.id, username: savedUser.username },
        config.secretKey,
        { expiresIn: "1h" }
      );

      // Return success response with user and token
      userRepo.successResponse(
        res,
        { user: savedUser.toObject(), token },
        "User registered successfully"
      );
    } catch (error) {
      console.error("Error registering user:", error);
      userRepo.errorResponse(res, 500, "Internal Server Error");
    }
  },

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return userRepo.errorResponse(res, 401, "Invalid credentials");
      }

      // Compare the provided password with the hashed password
      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) {
        return userRepo.errorResponse(res, 401, "Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.secretKey,
        { expiresIn: "1h" }
      );

      // Return success response with user and token
      userRepo.successResponse(
        res,
        { user: user.toObject(), token },
        "User logged in successfully"
      );
    } catch (error) {
      console.error("Error logging in user:", error);
      userRepo.errorResponse(res, 500, "Internal Server Error");
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { username, newPassword } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return userRepo.errorResponse(res, 404, "User not found");
      }

      // Hash the new password
      const hashedPassword = await argon2.hash(newPassword);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();

      // Return success response
      userRepo.successResponse(res, null, "Password reset successfully");
    } catch (error) {
      console.error("Error resetting password:", error);
      userRepo.errorResponse(res, 500, "Internal Server Error");
    }
  },
};

module.exports = userController;
