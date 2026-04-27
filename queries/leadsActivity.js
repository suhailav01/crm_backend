const getActivityByLeadsId = `
  SELECT
    ln.id,
    'note' AS type,
    ln.note_text AS title,
    NULL AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    ln.created_at
  FROM lead_notes ln
  LEFT JOIN users u ON ln.created_by = u.id
  WHERE ln.lead_id = $1

  UNION ALL

  SELECT
    le.id,
    'email' AS type,
    COALESCE(le.subject, 'No Subject') AS title,
    le.recipients AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    le.created_at
  FROM lead_emails le
  LEFT JOIN users u ON le.sent_by = u.id
  WHERE le.lead_id = $1

  UNION ALL

  SELECT
    lc.id,
    'call' AS type,
    lc.call_outcome AS title,
    lc.connected_to AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    lc.created_at
  FROM lead_calls lc
  LEFT JOIN users u ON lc.created_by = u.id
  WHERE lc.lead_id = $1

  UNION ALL

  SELECT
    lt.id,
    'task' AS type,
    lt.task_name AS title,
    lt.priority AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    lt.created_at
  FROM lead_tasks lt
  LEFT JOIN users u ON lt.created_by = u.id
  WHERE lt.lead_id = $1

  UNION ALL

  SELECT
    lm.id,
    'meeting' AS type,
    lm.title AS title,
    lm.location AS subtitle,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    lm.created_at
  FROM lead_meetings lm
  LEFT JOIN users u ON lm.created_by = u.id
  WHERE lm.lead_id = $1

  ORDER BY created_at DESC
`;

module.exports = {
    getActivityByLeadsId
}