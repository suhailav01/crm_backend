const pool = require("../config/db");
const queries = require("../queries/leadsAttachment");

const createAttachment = (lead_id, file_name, file_path, uploaded_by) => {
  return pool.query(queries.createAttachment, [
    lead_id,
    file_name,
    file_path,
    uploaded_by,
  ]);
};

const getAttachmentsByleads = (leadsId) => {
  return pool.query(queries.getAttachmentsByleads, [leadsId]);
};

const getAttachmentById = (id) => {
  return pool.query(queries.getAttachmentById, [id]);
};

const deleteAttachment = (id) => {
  return pool.query(queries.deleteAttachment, [id]);
};

module.exports = {
  createAttachment,
  getAttachmentsByleads,
  getAttachmentById,
  deleteAttachment,
};