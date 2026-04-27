const pool = require("../config/db");
const queries = require("../queries/ticketsEmail");

// get all emails by ticket id
const getEmailsByTicketId = async (ticketId) => {
  const result = await pool.query(queries.getEmailsByTicketId, [ticketId]);
  return result.rows;
};

// get single email by id
const getEmailById = async (id) => {
  const result = await pool.query(queries.getEmailById, [id]);
  return result.rows[0];
};

// create email
const createEmail = async ({
  ticket_id,
  recipients,
  cc,
  bcc,
  subject,
  body,
  sent_by,
}) => {
  const result = await pool.query(queries.createEmail, [
    ticket_id,
    recipients,
    cc,
    bcc,
    subject,
    body,
    sent_by,
  ]);

  return result.rows[0];
};

// update email
const updateEmail = async ({
  id,
  recipients,
  cc,
  bcc,
  subject,
  body,
}) => {
  const result = await pool.query(queries.updateEmail, [
    recipients,
    cc,
    bcc,
    subject,
    body,
    id,
  ]);

  return result.rows[0];
};

// delete email
const deleteEmail = async (id) => {
  const result = await pool.query(queries.deleteEmail, [id]);
  return result.rows[0];
};

module.exports = {
  getEmailsByTicketId,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
};