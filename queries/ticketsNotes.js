const getNotesByTicketId = `
  SELECT
    tn.*,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
  FROM ticket_notes tn
  LEFT JOIN users u ON tn.created_by = u.id
  WHERE tn.ticket_id = $1
  ORDER BY tn.created_at DESC
`;

const getNoteById = `
  SELECT *
  FROM ticket_notes
  WHERE id = $1
`;

const createNote = `
  INSERT INTO ticket_notes (
    ticket_id,
    note_text,
    created_by
  )
  VALUES ($1, $2, $3)
  RETURNING *
`;

const updateNote = `
  UPDATE ticket_notes
  SET
    note_text = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING *
`;

const deleteNote = `
  DELETE FROM ticket_notes
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getNotesByTicketId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};