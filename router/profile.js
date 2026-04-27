// routes/profile.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controller/profile");

const storage = multer.diskStorage({
  destination: "uploads/profile",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.put("/:id", controller.updateProfile);
router.put("/:id/image", upload.single("profile_image"), controller.uploadProfileImage);

module.exports = router;