const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const controller = require("../controller/ticketAttachment");

// Upload attachment
router.post("/upload", upload.single("file"), controller.uploadAttachment);

// Get attachments by ticket
router.get("/ticket/:ticket_id", controller.getAttachmentsByTicket);

// Delete attachment
router.delete("/:id", controller.deleteAttachment);

module.exports = router;