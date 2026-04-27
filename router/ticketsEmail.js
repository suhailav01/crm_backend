const express = require("express");
const router = express.Router();
const controller = require("../controller/ticketsEmail");
const upload = require("../middlewares/upload");
const protect = require('../middlewares/protect')
router.use(protect);
router.get("/single/:id", controller.getEmailById);
router.get("/:ticketId", controller.getEmailsByTicketId);

router.post("/", upload.single("attachment"), controller.createEmail);

router.put("/:id", controller.updateEmail);
router.delete("/:id", controller.deleteEmail);

module.exports = router;