
const pool = require("../config/db");
const queries = require("../queries/dealAttachment");

const createAttachment = (deal_id, file_name, file_path, uploaded_by) => {
  return pool.query(queries.createAttachment, [
    deal_id,
    file_name,
    file_path,
    uploaded_by,
  ]);
};

const getAttachmentsByDeal = (deal_id) => {
  return pool.query(queries.getAttachmentsByDeal, [deal_id]);
};

const getAttachmentById = (id) => {
  return pool.query(queries.getAttachmentById, [id]);
};

const deleteAttachment = (id) => {
  return pool.query(queries.deleteAttachment, [id]);
};

module.exports = {
  createAttachment,
  getAttachmentsByDeal,
  getAttachmentById,
  deleteAttachment,
};