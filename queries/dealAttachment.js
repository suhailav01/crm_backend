module.exports = {
  createAttachment: `
    INSERT INTO deal_attachments
    (deal_id, file_name, file_path, uploaded_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `,

  getAttachmentsByDeal: `
    SELECT * FROM deal_attachments
    WHERE deal_id = $1
    ORDER BY uploaded_at DESC;
  `,

  getAttachmentById: `
    SELECT * FROM deal_attachments WHERE id = $1;
  `,

  deleteAttachment: `
    DELETE FROM deal_attachments WHERE id = $1;
  `,
};