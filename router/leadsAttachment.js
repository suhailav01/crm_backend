const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const controller = require("../controller/leadsAttachment");

// Upload attachment
router.post("/upload", upload.single("file"), controller.uploadAttachment);

// Get attachments by lead
router.get("/lead/:lead_id", controller.getAttachmentsByLead);

// Delete attachment
router.delete("/:id", controller.deleteAttachment);

module.exports = router;