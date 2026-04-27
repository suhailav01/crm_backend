
const express = require("express");
const router = express.Router();
const controller = require("../controller/dealActivity");

router.get("/:dealId", controller.getActivityByDealId);

module.exports = router;