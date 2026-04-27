// controller/profile.js
const pool = require("../config/db");

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone_number = $3
       WHERE id = $4
       RETURNING id, first_name, last_name, email, role, phone_number, profile_image`,
      [first_name, last_name, phone_number, id]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.params;

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const result = await pool.query(
      `UPDATE users 
       SET profile_image = $1
       WHERE id = $2
       RETURNING id, first_name, last_name, email, role, phone_number, profile_image`,
      [imagePath, id]
    );

    res.json({
      success: true,
      message: "Profile image uploaded",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  updateProfile,
  uploadProfileImage,
};