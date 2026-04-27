const express = require("express");
const router = express.Router();
const controller = require("../controller/ticketActivity");

router.get("/:ticketId", controller.getActivityByTicketId);

module.exports = router;