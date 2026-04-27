
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const controller = require("../controller/dealAtttchments");

// Upload attachment
router.post("/upload", upload.single("file"), controller.uploadAttachment);

// Get attachments by deal
router.get("/deal/:deal_id", controller.getAttachmentsByDeal);

// Delete attachment
router.delete("/:id", controller.deleteAttachment);

module.exports = router;