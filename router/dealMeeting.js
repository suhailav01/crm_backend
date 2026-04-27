
const express = require("express");
const router = express.Router();
const controller = require("../controller/dealMeeting");

router.get("/single/:id", controller.getMeetingById);
router.get("/:dealId", controller.getMeetingsByDealId);
router.post("/", controller.createMeeting);
router.put("/:id", controller.updateMeeting);
router.delete("/:id", controller.deleteMeeting);

module.exports = router;