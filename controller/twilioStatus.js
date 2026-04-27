const repo = require("../repositories/ticketCalls");

const statusCallback = async (req, res) => {
  try {
    const { CallSid, CallStatus, CallDuration } = req.body;

    await repo.updateCallStatusBySid({
      twilio_sid: CallSid,
      call_status: CallStatus,
      duration_seconds: CallDuration ? Number(CallDuration) : null,
    });

    res.status(200).send("ok");
  } catch (error) {
    console.error("STATUS CALLBACK ERROR:", error);
    res.status(500).send("error");
  }
};

module.exports = {
  statusCallback,
};