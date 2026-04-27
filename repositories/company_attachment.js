const pool = require("../config/db");
const queries = require("../queries/company_attachments");

const createAttachment = (company_id, file_name, file_path, uploaded_by) => {
  return pool.query(queries.createAttachment, [
    company_id,
    file_name,
    file_path,
    uploaded_by,
  ]);
};

const getAttachmentsByCompany = (company_id) => {
  return pool.query(queries.getAttachmentsByCompany, [company_id]);
};

const getAttachmentById = (id) => {
  return pool.query(queries.getAttachmentById, [id]);
};

const deleteAttachment = (id) => {
  return pool.query(queries.deleteAttachment, [id]);
};

module.exports = {
  createAttachment,
  getAttachmentsByCompany,
  getAttachmentById,
  deleteAttachment,
};