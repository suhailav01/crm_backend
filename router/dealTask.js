
const express = require("express");
const router = express.Router();
const controller = require("../controller/dealTask");

router.get("/single/:id", controller.getTaskById);
router.get("/:dealId", controller.getTasksByDealId);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;