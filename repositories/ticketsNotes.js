const pool = require("../config/db");
const queries = require("../queries/ticketsNotes");

// get all notes by ticket id
const getNotesByTicketId = async (ticketId) => {
  const result = await pool.query(queries.getNotesByTicketId, [ticketId]);
  return result.rows;
};

// get single note by id
const getNoteById = async (id) => {
  const result = await pool.query(queries.getNoteById, [id]);
  return result.rows[0];
};

// create note
const createNote = async (ticket_id, note_text, created_by) => {
  const result = await pool.query(queries.createNote, [
    ticket_id,
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
  getNotesByTicketId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};