const pool = require("../config/db");
const queries = require("../queries/leadsEmail");

// get all emails by lead id
const getEmailsByLeadsId = async (leadsId) => {
  const result = await pool.query(queries.getEmailsByLeadsId, [leadsId]);
  return result.rows;
};

// get single email by id
const getEmailById = async (id) => {
  const result = await pool.query(queries.getEmailById, [id]);
  return result.rows[0];
};

// create email
const createEmail = async ({
  lead_id,
  recipients,
  cc,
  bcc,
  subject,
  body,
  sent_by,
}) => {
  const result = await pool.query(queries.createEmail, [
    lead_id,
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
  getEmailsByLeadsId,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
};