
const getActivityByDealId = `
  SELECT
    tn.id,
    'note' AS type,
    tn.note_text AS title,
    NULL AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    tn.created_at
  FROM deal_notes tn
  LEFT JOIN users u ON tn.created_by = u.id
  WHERE tn.deal_id = $1

  UNION ALL

  SELECT
    te.id,
    'email' AS type,
    COALESCE(te.subject, 'No Subject') AS title,
    te.recipients AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    te.created_at
  FROM deal_emails te
  LEFT JOIN users u ON te.sent_by = u.id
  WHERE te.deal_id = $1

  UNION ALL

  SELECT
    tc.id,
    'call' AS type,
    tc.call_outcome AS title,
    tc.connected_to AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    tc.created_at
  FROM deal_calls tc
  LEFT JOIN users u ON tc.created_by = u.id
  WHERE tc.deal_id = $1

  UNION ALL

  SELECT
    tt.id,
    'task' AS type,
    tt.task_name AS title,
    tt.priority AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    tt.created_at
  FROM deal_tasks tt
  LEFT JOIN users u ON tt.created_by = u.id
  WHERE tt.deal_id = $1

  UNION ALL

  SELECT
    tm.id,
    'meeting' AS type,
    tm.title AS title,
    tm.location AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    tm.created_at
  FROM deal_meetings tm
  LEFT JOIN users u ON tm.created_by = u.id
  WHERE tm.deal_id = $1

  ORDER BY created_at DESC
`;

module.exports = {
    getActivityByDealId
}