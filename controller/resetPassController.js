const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const { sendPasswordResetEmail } = require("../utils/emailUtils");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

exports.resetPassword = async (req, res) => {
  const { token, id, newPassword } = req.body;

  try {
    // Find the user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the token associated with the user
    const tokenDoc = await Token.findOne({ userId: id });
    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Compare the reset token with the one stored in the database
    const isValidToken = await bcrypt.compare(token, tokenDoc.token);
    if (!isValidToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the token from the database
    await tokenDoc.deleteOne();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
