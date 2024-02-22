const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  // Specify your email service provider SMTP details here
  service: "Gmail", // Example: Gmail
  auth: {
    user: "vedantb658@gmail.com", // Your email address
    pass: "kdoi srhw abus egus", // Your email password or application-specific password
  },
});

// Function to send a password reset email
async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetLink = `http://localhost:5173/reset?token=${resetToken}&email=${email}`;
    // Replace "your_other_port" with the port where your reset page is hosted

    // Send email
    await transporter.sendMail({
      from: "vedantb658@gmail.com", // Your email address
      to: email, // Recipient email address
      subject: "Password Reset Request", // Email subject
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      `, // Email body with the reset link
    });
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}


module.exports = { sendPasswordResetEmail };
