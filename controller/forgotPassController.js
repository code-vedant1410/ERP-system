const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const { sendPasswordResetEmail } = require("../utils/emailUtils");
const crypto = require("crypto"); // Importing the crypto module for generating tokens
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete any existing tokens associated with the user
    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const resetLink = `http://localhost:5173/reset?token=${resetToken}&id=${user._id}`;

    // Construct reset link with token
    await sendPasswordResetEmail(email, resetLink); // Send reset link to user's email

    return res.status(200).json({
      message:
        "Password recovery link sent to your email, please check your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
