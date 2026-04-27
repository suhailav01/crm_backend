const express = require("express");
const router = express.Router();
const controller = require("../controller/ticketsNotes");

router.get("/single/:id", controller.getNoteById);
router.get("/:ticketId", controller.getNotesByTicketId);
router.post("/", controller.createNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;