const getNotesByCompanyId = `
  SELECT
    cn.*,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
  FROM company_notes cn
  LEFT JOIN users u ON cn.created_by = u.id
  WHERE cn.company_id = $1
  ORDER BY cn.created_at DESC
`;

const getNoteById = `
  SELECT *
  FROM company_notes
  WHERE id = $1
`;

const createNote = `
  INSERT INTO company_notes (
    company_id,
    note_text,
    created_by
  )
  VALUES ($1, $2, $3)
  RETURNING *
`;

const updateNote = `
  UPDATE company_notes
  SET
    note_text = $1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING *
`;

const deleteNote = `
  DELETE FROM company_notes
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getNotesByCompanyId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};