const express = require("express");
const router = express.Router();
const controller = require("../controller/dashboard");

router.get("/", controller.getDashboardController);

module.exports = router;