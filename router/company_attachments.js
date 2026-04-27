const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const controller = require("../controller/company_attachmend");

// Upload attachment
router.post("/upload", upload.single("file"), controller.uploadAttachment);

// Get attachments by company
router.get("/company/:company_id", controller.getAttachmentsByCompany);

// Delete attachment
router.delete("/:id", controller.deleteAttachment);

module.exports = router;