
const getCallsByDealId = `
  SELECT
    tc.*,

    -- user name (who created/logged the call)
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name

  FROM deal_calls tc

  LEFT JOIN users u ON tc.created_by = u.id

  WHERE tc.deal_id = $1
  ORDER BY tc.created_at DESC
`;

const getCallById = `
  SELECT *
  FROM deal_calls
  WHERE id = $1
`;



const updateCall = `
  UPDATE deal_calls
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
  DELETE FROM deal_calls
  WHERE id = $1
  RETURNING *
`;
const createCall = `
  INSERT INTO deal_calls (
    deal_id,
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
  VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME, $4, $5, $6, $7, $8)
  RETURNING *
`;

const updateCallStatusBySid = `
  UPDATE deal_calls
  SET
    call_status = $1,
    duration_seconds = $2
  WHERE twilio_sid = $3
  RETURNING *
`;
module.exports = {
  getCallsByDealId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
  updateCallStatusBySid
  
};