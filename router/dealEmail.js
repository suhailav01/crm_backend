
const express = require("express");
const router = express.Router();
const controller = require("../controller/dealEmail");

router.get("/single/:id", controller.getEmailById);
router.get("/:dealId", controller.getEmailsByDealId);
router.post("/", controller.createEmail);
router.put("/:id", controller.updateEmail);
router.delete("/:id", controller.deleteEmail);

module.exports = router;