const express = require("express");
const router = express.Router();
const controller = require("../controller/leadsActivity");

router.get("/:leadId", controller.getActivityByLeadsId);

module.exports = router;