const express = require("express");
const router = express.Router();
const controller = require("../controller/ticketMeeting");
const protect = require('../middlewares/protect');
router.use(protect);
router.get("/single/:id", controller.getMeetingById);
router.get("/:ticketId", controller.getMeetingsByTicketId);
router.post("/", controller.createMeeting);
router.put("/:id", controller.updateMeeting);
router.delete("/:id", controller.deleteMeeting);

module.exports = router;