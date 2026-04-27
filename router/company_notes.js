const express = require("express");
const router = express.Router();
const controller = require("../controller/company_notes");

router.get("/single/:id", controller.getNoteById);
router.get("/:companyId", controller.getNotesByCompanyId);
router.post("/", controller.createNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;