const express = require("express");
const router = express.Router();
const controller = require("../controller/leadsTasks");

router.get("/single/:id", controller.getTaskById);
router.get("/:leadId", controller.getTasksByLeadId);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;