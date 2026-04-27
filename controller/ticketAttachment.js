const repo = require("../repositories/ticketAttachment");
const fs = require("fs");

const uploadAttachment = async (req, res) => {
  try {
    const file = req.file;
    const { ticket_id, uploaded_by } = req.body;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!ticket_id) {
      return res.status(400).json({ message: "ticket_id is required" });
    }

    const filePath = `uploads/${file.filename}`;

    const result = await repo.createAttachment(
      ticket_id,
      file.originalname,
      filePath,
      uploaded_by || null
    );

    res.status(201).json({
      message: "Attachment uploaded successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getAttachmentsByTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const result = await repo.getAttachmentsByTicket(ticket_id);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await repo.getAttachmentById(id);

    if (!file.rows.length) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const filePath = file.rows[0].file_path;

    // delete file from folder
    fs.unlink(filePath, (err) => {
      if (err) console.log("File delete error:", err);
    });

    await repo.deleteAttachment(id);

    res.json({ message: "Attachment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadAttachment,
  getAttachmentsByTicket,
  deleteAttachment,
};