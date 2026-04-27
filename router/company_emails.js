const express = require("express");
const router = express.Router();
const controller = require("../controller/company_emails");
const upload = require("../middlewares/upload");
const protect = require('../middlewares/protect')
router.use(protect);
router.get("/single/:id", controller.getEmailById);
router.get("/:companyId", controller.getEmailsByCompanyId);
router.post("/", upload.single("attachment"), controller.createEmail);
router.put("/:id", controller.updateEmail);
router.delete("/:id", controller.deleteEmail);

module.exports = router;