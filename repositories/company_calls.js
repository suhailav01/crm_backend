const pool = require("../config/db");
const queries = require("../queries/company_calls");

// get all calls by company id
const getCallsByCompanyId = async (companyId) => {
  const result = await pool.query(queries.getCallsByCompanyId, [companyId]);
  return result.rows;
};

// get single call by id
const getCallById = async (id) => {
  const result = await pool.query(queries.getCallById, [id]);
  return result.rows[0];
};

// create call
const createCall = async (
  ticket_id,
  connected_to,
  call_outcome,
  call_date,
  call_time,
  note,
  created_by
) => {
  const result = await pool.query(queries.createCall, [
    ticket_id,
    connected_to,
    call_outcome,
    call_date,
    call_time,
    note,
    created_by,
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
  company_id,
  connected_to,
  note,
  created_by,
  twilio_sid,
  phone_number,
  call_status,
}) => {
  const result = await pool.query(queries.createCall, [
    company_id,
    connected_to,
    "initiated",
    note,
    created_by,
    twilio_sid,
    phone_number,
    call_status,
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
  getCallsByCompanyId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
  createTwilioCallLog,
  updateCallStatusBySid
};