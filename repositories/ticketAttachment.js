const pool = require("../config/db");
const queries = require("../queries/ticketAttachment");

const createAttachment = (ticket_id, file_name, file_path, uploaded_by) => {
  return pool.query(queries.createAttachment, [
    ticket_id,
    file_name,
    file_path,
    uploaded_by,
  ]);
};

const getAttachmentsByTicket = (ticket_id) => {
  return pool.query(queries.getAttachmentsByTicket, [ticket_id]);
};

const getAttachmentById = (id) => {
  return pool.query(queries.getAttachmentById, [id]);
};

const deleteAttachment = (id) => {
  return pool.query(queries.deleteAttachment, [id]);
};

module.exports = {
  createAttachment,
  getAttachmentsByTicket,
  getAttachmentById,
  deleteAttachment,
};