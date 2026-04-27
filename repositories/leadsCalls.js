const pool = require("../config/db");
const queries = require("../queries/leadsCall");

// get all calls by lead id
const getCallsByLeadsId = async (leadsId) => {
  const result = await pool.query(queries.getCallsByLeadsId, [leadsId]);
  return result.rows;
};

// get single call by id
const getCallById = async (id) => {
  const result = await pool.query(queries.getCallById, [id]);
  return result.rows[0];
};

// create call
const createCall = async (
  lead_id,
  connected_to,
  call_outcome,
  call_date,
  call_time,
  note,
  created_by
) => {
  const result = await pool.query(queries.createCall, [
    lead_id,
    connected_to,
    call_outcome,
    call_date,
    call_time,
    note,
    created_by,
    null,       // twilio_sid
    null,       // phone_number
    "manual",   // call_status
  ]);
  return result.rows[0];
};

// update call
const updateCall = async (
  id,
  connected_to,
  call_outcome,
  call_date,
  call_time,
  note
) => {
  const result = await pool.query(queries.updateCall, [
    connected_to,
    call_outcome,
    call_date,
    call_time,
    note,
    id,
  ]);
  return result.rows[0];
};

// delete call
const deleteCall = async (id) => {
  const result = await pool.query(queries.deleteCall, [id]);
  return result.rows[0];
};
const createTwilioCallLog = async ({
  lead_id,
  connected_to,
  call_outcome,
  call_date,
  call_time,
  note,
  created_by,
  twilio_sid,
  phone_number,
  call_status,
}) => {
  const result = await pool.query(queries.createCall, [
    lead_id,
    connected_to,
    call_outcome || "initiated",
    call_date || new Date().toISOString().split("T")[0],
    call_time || new Date().toTimeString().split(" ")[0],
    note || "Call initiated from CRM",
    created_by || null,
    twilio_sid || null,
    phone_number || null,
    call_status || "initiated",
  ]);

  return result.rows[0];
};

const updateCallStatusBySid = async ({
  twilio_sid,
  call_status,
  duration_seconds,
}) => {
  const result = await pool.query(queries.updateCallStatusBySid, [
    call_status,
    duration_seconds || null,
    twilio_sid,
  ]);

  return result.rows[0];
};
module.exports = {
  getCallsByLeadsId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
  createTwilioCallLog,
  updateCallStatusBySid
};