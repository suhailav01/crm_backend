const getCallsByLeadsId = `
  SELECT
    lc.*,

    -- user name (who created/logged the call)
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name

  FROM lead_calls lc

  LEFT JOIN users u ON lc.created_by = u.id

  WHERE lc.lead_id = $1
  ORDER BY lc.created_at DESC
`;

const getCallById = `
  SELECT *
  FROM lead_calls
  WHERE id = $1
`;



const updateCall = `
  UPDATE lead_calls
  SET
    connected_to = $1,
    call_outcome = $2,
    call_date = $3,
    call_time = $4,
    note = $5,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *
`;

const deleteCall = `
  DELETE FROM lead_calls
  WHERE id = $1
  RETURNING *
`;
const createCall = `
INSERT INTO lead_calls (
  lead_id,
  connected_to,
  call_outcome,
  call_date,
  call_time,
  note,
  created_by,
  twilio_sid,
  phone_number,
  call_status
)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
RETURNING *
`;
const updateCallStatusBySid = `
  UPDATE lead_calls
  SET
    call_status = $1,
    duration_seconds = $2
  WHERE twilio_sid = $3
  RETURNING *
`;
module.exports = {
  getCallsByLeadsId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
  updateCallStatusBySid
  
};