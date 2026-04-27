const pool = require("../config/db");
const queries = require("../queries/company_notes");

// get all notes by company id
const getNotesByCompanyId = async (companyId) => {
  const result = await pool.query(queries.getNotesByCompanyId, [companyId]);
  return result.rows;
};

// get single note by id
const getNoteById = async (id) => {
  const result = await pool.query(queries.getNoteById, [id]);
  return result.rows[0];
};

// create note
const createNote = async (company_id, note_text, created_by) => {
  const result = await pool.query(queries.createNote, [
    company_id,
    note_text,
    created_by,
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
  getNotesByCompanyId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};