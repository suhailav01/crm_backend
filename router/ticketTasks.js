const express = require("express");
const router = express.Router();
const controller = require("../controller/ticketTasks");
const protect = require('../middlewares/protect');
router.use(protect);
router.get("/single/:id", controller.getTaskById);
router.get("/:ticketId", controller.getTasksByTicketId);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;