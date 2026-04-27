

const express = require("express");
const router = express.Router();
const controller = require("../controller/dealCall");
const twilioVoice = require("../controller/twilioVoice");
const twilioStatus = require("../controller/twilioStatus");

router.get("/single/:id", controller.getCallById);
router.get("/:dealId", controller.getCallsByDealId);
router.post("/", controller.createCall);
router.put("/:id", controller.updateCall);
router.delete("/:id", controller.deleteCall);


// 🔥 Twilio routes first
router.post("/make-call", controller.makeCall);
router.post("/end-call/:callSid", controller.endCall);
router.post("/twiml", twilioVoice.outboundTwiml);
router.post("/status-callback", twilioStatus.statusCallback);



module.exports = router;