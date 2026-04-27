const getMeetingsByTicketId = `
  SELECT
    tm.*,

    -- user name (who created meeting)
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name

  FROM ticket_meetings tm

  LEFT JOIN users u ON tm.created_by = u.id

  WHERE tm.ticket_id = $1
  ORDER BY tm.created_at DESC
`;

const getMeetingById = `
  SELECT *
  FROM ticket_meetings
  WHERE id = $1
`;

const createMeeting = `
  INSERT INTO ticket_meetings (
    ticket_id,
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
  UPDATE ticket_meetings
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
  DELETE FROM ticket_meetings
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getMeetingsByTicketId,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};