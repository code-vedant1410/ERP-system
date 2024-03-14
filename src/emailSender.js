const nodemailer = require("nodemailer");

async function sendEmail(userEmail, subject, body, attachmentPath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inframax07@gmail.com",
      pass: "xoqr beri hcac cnjx",
    },
  });

  const mailOptions = {
    from: "inframax07@gmail.com",
    to: userEmail,
    subject: subject,
    text: body,
    attachments: [{ filename: "bill.pdf", path: attachmentPath }],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
