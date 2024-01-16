const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");
const { createTransporter } = require("../utils/emailUtils");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Forgot Password - Generate Token and Send Reset Email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ "contact.email": email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random token (you can use a library like `crypto` for secure token generation)
    const token = Math.random().toString(36).substr(2, 10);

    // Set reset token and expiration time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

   

    const mailOptions = {
      from: "your_email@example.com",
      to: email,
      subject: "Reset Your Password",
      text: `Use this token to reset your password: ${token}`,
    };

    // transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Reset token sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });

  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordToken !== token ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid token or token expired" });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
