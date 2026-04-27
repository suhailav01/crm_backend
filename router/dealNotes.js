
const express = require("express");
const router = express.Router();
const controller = require("../controller/dealNotes");

router.get("/single/:id", controller.getNoteById);
router.get("/:dealId", controller.getNotesByDealId);
router.post("/", controller.createNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;