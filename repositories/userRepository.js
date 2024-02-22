// userRepository.js

// This file contains functions related to interacting with the user collection in the database.

const User = require("../models/userModel");

const userRepository = {
  // Function to find a user by username
  findByUsername: async (username) => {
    try {
      return await User.findOne({ username });
    } catch (error) {
      throw new Error("Error finding user by username");
    }
  },

  // Function to save a new user
  save: async (userData) => {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error("Error saving user");
    }
  },

  // Function to handle error responses
  errorResponse: (res, statusCode, message, error) => {
    if (error && error.message) {
      return res.status(statusCode).json({ message, error: error.message });
    } else {
      return res.status(statusCode).json({ message });
    }
  },


  // Function to handle success responses
  successResponse: (res, data, message) => {
    return res.status(200).json({ data, message });
  },
};

module.exports = userRepository;
