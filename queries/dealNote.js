
const getNotesByDealId = `
  SELECT
    tn.*,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
  FROM deal_notes tn
  LEFT JOIN users u ON tn.created_by = u.id
  WHERE tn.deal_id = $1
  ORDER BY tn.created_at DESC
`;

const getNoteById = `
  SELECT *
  FROM deal_notes
  WHERE id = $1
`;

const createNote = `
  INSERT INTO deal_notes (
    deal_id,
    note_text,
    created_by
  )
  VALUES ($1, $2, $3)
  RETURNING *
`;

const updateNote = `
  UPDATE deal_notes
  SET
    note_text = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING *
`;

const deleteNote = `
  DELETE FROM deal_notes
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getNotesByDealId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};