const pool = require("../config/db");
const queries = require("../queries/leadsMeeting");

// get all meetings by lead id
const getMeetingsByLeadId = async (leadId) => {
  const result = await pool.query(queries.getMeetingsByLeadId, [leadId]);
  return result.rows;
};

// get single meeting by id
const getMeetingById = async (id) => {
  const result = await pool.query(queries.getMeetingById, [id]);
  return result.rows[0];
};

// create meeting
const createMeeting = async (
  lead_id,
  title,
  start_date,
  start_time,
  end_time,
  attendees,
  location,
  reminder,
  note,
  created_by
) => {
  const result = await pool.query(queries.createMeeting, [
    lead_id,
    title,
    start_date,
    start_time,
    end_time,
    attendees,
    location,
    reminder,
    note,
    created_by,
  ]);
  return result.rows[0];
};

// update meeting
const updateMeeting = async (
  id,
  title,
  start_date,
  start_time,
  end_time,
  attendees,
  location,
  reminder,
  note
) => {
  const result = await pool.query(queries.updateMeeting, [
    title,
    start_date,
    start_time,
    end_time,
    attendees,
    location,
    reminder,
    note,
    id,
  ]);
  return result.rows[0];
};

// delete meeting
const deleteMeeting = async (id) => {
  const result = await pool.query(queries.deleteMeeting, [id]);
  return result.rows[0];
};

module.exports = {
  getMeetingsByLeadId,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};