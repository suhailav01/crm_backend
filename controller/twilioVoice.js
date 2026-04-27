const twilio = require("twilio");

const outboundTwiml = async (req, res) => {
  try {
    const customerNumber = req.query.customer;
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.say(
      { voice: "alice" },
      "Connecting your CRM call now."
    );

    const dial = twiml.dial({
      callerId: process.env.TWILIO_PHONE_NUMBER,
    });

    dial.number(customerNumber);

    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.error("TWIML ERROR:", error);
    res.status(500).send("Twilio TwiML error");
  }
};

module.exports = {
  outboundTwiml,
};