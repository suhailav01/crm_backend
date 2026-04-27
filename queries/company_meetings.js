const getMeetingsByCompanyId = `
  SELECT
    cm.*,

    -- user name (who created meeting)
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name

  FROM company_meetings cm

  LEFT JOIN users u ON cm.created_by = u.id

  WHERE cm.company_id = $1
  ORDER BY cm.created_at DESC
`;

const getMeetingById = `
  SELECT *
  FROM company_meetings
  WHERE id = $1
`;

const createMeeting = `
  INSERT INTO company_meetings (
    company_id,
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
  UPDATE company_meetings
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
  DELETE FROM company_meetings
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getMeetingsByCompanyId,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};