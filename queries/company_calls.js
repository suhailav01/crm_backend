const getCallsByCompanyId = `
  SELECT
    cc.*,

    -- user name (who created/logged the call)
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name

  FROM company_calls cc

  LEFT JOIN users u ON cc.created_by = u.id

  WHERE cc.company_id = $1
  ORDER BY cc.created_at DESC
`;

const getCallById = `
  SELECT *
  FROM company_calls
  WHERE id = $1
`;

const updateCall = `
  UPDATE company_calls
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
  DELETE FROM company_calls
  WHERE id = $1
  RETURNING *
`;

const createCall = `
  INSERT INTO company_calls (
    company_id,
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
  UPDATE company_calls
  SET
    call_status = $1,
    duration_seconds = $2
  WHERE twilio_sid = $3
  RETURNING *
`;

module.exports = {
  getCallsByCompanyId,
  getCallById,
  createCall,
  updateCall,
  deleteCall,
  updateCallStatusBySid
};