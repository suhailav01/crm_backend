const repo = require("../repositories/company_notes");

// get notes by company id
const getNotesByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;

    const data = await repo.getNotesByCompanyId(companyId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET NOTES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single note by id
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await repo.getNoteById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET NOTE BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create note
const createNote = async (req, res) => {
  try {
    const { company_id, note_text, created_by } = req.body;

    if (!company_id || !note_text) {
      return res.status(400).json({
        success: false,
        message: "company_id and note_text are required",
      });
    }

    const data = await repo.createNote(
      company_id,
      note_text,
      created_by || null
    );

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data,
    });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note_text } = req.body;

    if (!note_text) {
      return res.status(400).json({
        success: false,
        message: "note_text is required",
      });
    }

    const existingNote = await repo.getNoteById(id);

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const data = await repo.updateNote(id, note_text);

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const existingNote = await repo.getNoteById(id);

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const data = await repo.deleteNote(id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data,
    });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotesByCompanyId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};