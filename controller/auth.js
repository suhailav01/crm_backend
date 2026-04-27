const crypto = require("crypto");
const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");
const { hashPassword } = require("../utils/hashPasswordHandler");
const asyncHandler = require("../middlewares/asyncHandler");

// 🔹 Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (!userResult.rows.length) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const user = userResult.rows[0];
  const token = crypto.randomBytes(32).toString("hex");
  const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.query(
    "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1,$2,$3)",
    [user.id, token, expires_at]
  );

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: `Click this link to reset your password: ${resetUrl}`,
  });

  res.status(200).json({ success: true, message: "Password reset email sent" });
});

// 🔹 Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const resetResult = await pool.query(
    "SELECT * FROM password_resets WHERE token=$1 AND expires_at>NOW()",
    [token]
  );

  if (!resetResult.rows.length) {
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }

  const reset = resetResult.rows[0];
  const hashedPassword = hashPassword(newPassword);

  await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedPassword, reset.user_id]);
  await pool.query("DELETE FROM password_resets WHERE id=$1", [reset.id]);

  res.status(200).json({ success: true, message: "Password successfully reset" });
});

module.exports = { forgotPassword, resetPassword };