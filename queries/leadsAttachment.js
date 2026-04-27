module.exports = {
  createAttachment: `
    INSERT INTO leadattachments
    (lead_id, file_name, file_path, uploaded_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `,

  getAttachmentsByleads: `
    SELECT * FROM leadattachments
    WHERE lead_id = $1
    ORDER BY uploaded_at DESC;
  `,

  getAttachmentById: `
    SELECT * FROM leadattachments WHERE id = $1;
  `,

  deleteAttachment: `
    DELETE FROM leadattachments WHERE id = $1 RETURNING *;
  `,
};