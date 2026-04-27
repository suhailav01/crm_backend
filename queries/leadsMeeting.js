const getMeetingsByLeadId = `
  SELECT
    lm.*,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
  FROM lead_meetings lm
  LEFT JOIN users u ON lm.created_by = u.id
  WHERE lm.lead_id = $1
  ORDER BY lm.created_at DESC
`;

const getMeetingById = `
  SELECT
    lm.*,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
  FROM lead_meetings lm
  LEFT JOIN users u ON lm.created_by = u.id
  WHERE lm.id = $1
`;

const createMeeting = `
  INSERT INTO lead_meetings (
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
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
`;

const updateMeeting = `
  UPDATE lead_meetings
  SET
    title = $1,
    start_date = $2,
    start_time = $3,
    end_time = $4,
    attendees = $5,
    location = $6,
    reminder = $7,
    note = $8,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $9
  RETURNING *
`;

const deleteMeeting = `
  DELETE FROM lead_meetings
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getMeetingsByLeadId,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};