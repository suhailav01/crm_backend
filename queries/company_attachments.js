module.exports = {
  createAttachment: `
    INSERT INTO attachments
    (company_id, file_name, file_path, uploaded_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `,

  getAttachmentsByCompany: `
    SELECT * FROM attachments
    WHERE company_id = $1
    ORDER BY uploaded_at DESC;
  `,

  getAttachmentById: `
    SELECT * FROM attachments WHERE id = $1;
  `,

  deleteAttachment: `
    DELETE FROM attachments WHERE id = $1;
  `,
};