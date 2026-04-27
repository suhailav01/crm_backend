
const pool = require("../config/db");
const queries = require("../queries/dealMeeting");

// get all meetings by ticket id
const getMeetingsByDealId = async (dealId) => {
  const result = await pool.query(queries.getMeetingsByDealId, [dealId]);
  return result.rows;
};

// get single meeting by id
const getMeetingById = async (id) => {
  const result = await pool.query(queries.getMeetingById, [id]);
  return result.rows[0];
};

// create meeting
const createMeeting = async (
  deal_id,
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
    deal_id,
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
  getMeetingsByDealId,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};