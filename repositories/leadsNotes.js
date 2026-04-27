const pool = require("../config/db");
const queries = require("../queries/leadsNotes");

// get all notes by lead id
const getNotesByLeadsId = async (leadsId) => {
  const result = await pool.query(queries.getNotesByLeadsId, [leadsId]);
  return result.rows;
};

// get single note by id
const getNoteById = async (id) => {
  const result = await pool.query(queries.getNoteById, [id]);
  return result.rows[0];
};

const createNote = async (lead_id, note_text, created_by, attachments) => {

  const attachmentsJson = JSON.stringify(attachments || []);

  const result = await pool.query(queries.createNote, [
    lead_id,
    note_text,
    created_by,
    attachmentsJson
  ]);

  return result.rows[0];
};
// update note
const updateNote = async (id, note_text) => {
  const result = await pool.query(queries.updateNote, [note_text, id]);
  return result.rows[0];
};

// delete note
const deleteNote = async (id) => {
  const result = await pool.query(queries.deleteNote, [id]);
  return result.rows[0];
};

module.exports = {
  getNotesByLeadsId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};