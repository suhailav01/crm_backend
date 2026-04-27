const express = require("express");
const router = express.Router();
const controller = require("../controller/leadsCalls");
const { outboundTwiml } = require("../controller/twilioVoice");

router.post("/make-call", controller.makeCall);

router.get("/twiml", outboundTwiml);
router.post("/twiml", outboundTwiml);
router.post("/status-callback", controller.statusCallback);

router.post("/end-call/:callSid", controller.endCall);

router.get("/single/:id", controller.getCallById);

router.get("/:leadId", controller.getCallsByleadId);
router.post("/", controller.createCall);

router.put("/:id", controller.updateCall);

router.delete("/:id", controller.deleteCall);

module.exports = router;