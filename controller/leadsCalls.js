const repo = require("../repositories/leadsCalls");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// get calls by lead id
const getCallsByleadId = async (req, res) => {
  try {
    const { leadId } = req.params;

    const data = await repo.getCallsByLeadsId(leadId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET CALLS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single call by id
const getCallById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await repo.getCallById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET CALL BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create call
const createCall = async (req, res) => {
  try {
    const {
      lead_id,
      connected_to,
      call_outcome,
      call_date,
      call_time,
      note,
      created_by,
    } = req.body;

    if (
      !lead_id ||
      !connected_to ||
      !call_outcome ||
      !call_date ||
      !call_time
    ) {
      return res.status(400).json({
        success: false,
        message: "lead_id, connected_to, call_outcome, call_date and call_time are required",
      });
    }

    const data = await repo.createCall(
      lead_id,
      connected_to,
      call_outcome,
      call_date,
      call_time,
      note || null,
      created_by || null
    );

    res.status(201).json({
      success: true,
      message: "Call created successfully",
      data,
    });
  } catch (error) {
    console.error("CREATE CALL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update call
const updateCall = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      connected_to,
      call_outcome,
      call_date,
      call_time,
      note,
    } = req.body;

    if (!connected_to || !call_outcome || !call_date || !call_time) {
      return res.status(400).json({
        success: false,
        message: "connected_to, call_outcome, call_date and call_time are required",
      });
    }

    const existingCall = await repo.getCallById(id);

    if (!existingCall) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    const data = await repo.updateCall(
      id,
      connected_to,
      call_outcome,
      call_date,
      call_time,
      note || null
    );

    res.status(200).json({
      success: true,
      message: "Call updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE CALL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete call
const deleteCall = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCall = await repo.getCallById(id);

    if (!existingCall) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    const data = await repo.deleteCall(id);

    res.status(200).json({
      success: true,
      message: "Call deleted successfully",
      data,
    });
  } catch (error) {
    console.error("DELETE CALL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// existing functions stay as they are

const makeCall = async (req, res) => {
  try {
    const { lead_id, customer_phone, connected_to, created_by } = req.body;

    if (!lead_id || !customer_phone) {
      return res.status(400).json({
        success: false,
        message: "lead_id and customer_phone are required",
      });
    }

    // 1. Twilio first calls the agent
   const call = await client.calls.create({
  to: customer_phone,
  from: process.env.TWILIO_PHONE_NUMBER,
  url: `${process.env.BASE_URL}/api/v1/lead-calls/twiml?customer=${encodeURIComponent(customer_phone)}`,
  statusCallback: `${process.env.BASE_URL}/api/v1/lead-calls/status-callback`,
  statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
  statusCallbackMethod: "POST",
});

    // 2. Save call log in DB
    const data = await repo.createTwilioCallLog({
      lead_id,
      connected_to: connected_to || customer_phone,
      note: "Call initiated from CRM",
      created_by: created_by || null,
      twilio_sid: call.sid,
      phone_number: customer_phone,
      call_status: call.status || "initiated",
    });

    res.status(201).json({
      success: true,
      message: "Phone call initiated successfully",
      data,
    });
 } catch (error) {
  console.error("MAKE CALL ERROR:", error);

  const rawMessage = error.message || "Failed to start phone call";

  if (
    rawMessage.includes("unverified") ||
    rawMessage.includes("verified numbers") ||
    rawMessage.includes("Trial accounts")
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Twilio trial account can call only verified numbers. Please verify this customer number in Twilio Console or upgrade the account."
    });
  }

  res.status(500).json({
    success: false,
    message: rawMessage,
  });
}
};
const endCall = async (req, res) => {
  try {
    const { callSid } = req.params;

    if (!callSid) {
      return res.status(400).json({
        success: false,
        message: "callSid is required",
      });
    }

    const call = await client.calls(callSid).update({
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      message: "Call ended successfully",
      data: call,
    });
  } catch (error) {
    console.error("END CALL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to end call",
    });
};
}
const statusCallback = async (req, res) => {
  try {

    const { CallSid, CallStatus, CallDuration } = req.body;

    await repo.updateCallStatusBySid({
      twilio_sid: CallSid,
      call_status: CallStatus,
      duration_seconds: CallDuration,
    });

    res.sendStatus(200);

  } catch (error) {
    console.error("STATUS CALLBACK ERROR:", error);
    res.sendStatus(500);
  }
};
module.exports = {
  getCallsByleadId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
  makeCall,
  endCall,
  statusCallback
};