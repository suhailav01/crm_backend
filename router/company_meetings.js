const express = require("express");
const router = express.Router();
const controller = require("../controller/company_meetings");
const protect = require('../middlewares/protect');
router.use(protect);
router.get("/single/:id", controller.getMeetingById);
router.get("/:companyId", controller.getMeetingsByCompanyId);
router.post("/", controller.createMeeting);
router.put("/:id", controller.updateMeeting);
router.delete("/:id", controller.deleteMeeting);

module.exports = router;