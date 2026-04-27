const getNotesByLeadsId = `
SELECT *
FROM lead_notes
WHERE lead_id = $1
ORDER BY created_at DESC;
`;

const getNoteById = `
  SELECT *
  FROM lead_notes
  WHERE id = $1
`;

const createNote = `
INSERT INTO lead_notes (lead_id, note_text, created_by, attachments)
VALUES ($1, $2, $3, $4)
RETURNING *;
`;

const updateNote = `
  UPDATE lead_notes
  SET
    note_text = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING *
`;

const deleteNote = `
  DELETE FROM lead_notes
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getNotesByLeadsId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};