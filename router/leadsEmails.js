const express = require("express");
const router = express.Router();
const controller = require("../controller/leadsEmail");
const upload = require("../middlewares/upload");

router.get("/single/:id", controller.getEmailById);
router.get("/:leadId", controller.getEmailsByLeadId);
router.post(
  "/",
  upload.array("attachments"),  
  controller.createEmail
);router.put("/:id", controller.updateEmail);
router.delete("/:id", controller.deleteEmail);

module.exports = router;