const express = require("express");
const router = express.Router();
const controller = require("../controller/leadsMeeting");

router.get("/single/:id", controller.getMeetingById);
router.get("/:leadId", controller.getMeetingsByLeadId);
router.post("/", controller.createMeeting);
router.put("/:id", controller.updateMeeting);
router.delete("/:id", controller.deleteMeeting);

module.exports = router;