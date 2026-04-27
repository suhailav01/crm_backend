const express = require("express");
const router = express.Router();
const controller = require("../controller/company_calls");
const twilioVoice = require("../controller/twilioVoice");
const twilioStatus = require("../controller/twilioStatus");

// 🔥 Twilio routes first
router.post("/make-call", controller.makeCall);
router.post("/end-call/:callSid", controller.endCall);
router.post("/twiml", twilioVoice.outboundTwiml);
router.post("/status-callback", twilioStatus.statusCallback);

// Existing routes
router.get("/single/:id", controller.getCallById);
router.get("/:companyId", controller.getCallsByCompanyId);
router.post("/", controller.createCall);
router.put("/:id", controller.updateCall);
router.delete("/:id", controller.deleteCall);

module.exports = router;