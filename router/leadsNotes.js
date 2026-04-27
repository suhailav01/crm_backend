const express = require("express");
const router = express.Router();
const controller = require("../controller/leadsNotes");
const upload = require("../middlewares/upload");


router.get("/single/:id", controller.getNoteById);
router.get("/:leadId", controller.getNotesByLeadId);
router.post(
  "/",
  upload.array("attachments"),
  controller.createNote
);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;