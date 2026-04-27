const getEmailsByTicketId = `
  SELECT
    e.*,
    CONCAT(u.first_name, ' ', u.last_name) AS sent_by_name
  FROM ticket_emails e
  LEFT JOIN users u ON e.sent_by = u.id
  WHERE e.ticket_id = $1
  ORDER BY e.created_at DESC
`;

const getEmailById = `
  SELECT *
  FROM ticket_emails
  WHERE id = $1
`;

const createEmail = `
  INSERT INTO ticket_emails (
    ticket_id,
    recipients,
    cc,
    bcc,
    subject,
    body,
    sent_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
`;

const updateEmail = `
  UPDATE ticket_emails
  SET
    recipients = $1,
    cc = $2,
    bcc = $3,
    subject = $4,
    body = $5,
    sent_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *
`;

const deleteEmail = `
  DELETE FROM ticket_emails
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getEmailsByTicketId,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
};