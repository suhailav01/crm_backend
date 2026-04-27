const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter ONCE (not inside function)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html, cc, bcc,attachments = []  }) => {
  const mailOptions = {
    from: `"CRM App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: text || "",
    html: html || "",
    cc: cc || undefined,
    bcc: bcc || undefined,
    attachments,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;