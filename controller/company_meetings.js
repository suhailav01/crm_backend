const repo = require("../repositories/company_meetings");

// get meetings by company id
const getMeetingsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;

    const data = await repo.getMeetingsByCompanyId(companyId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET MEETINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single meeting by id
const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await repo.getMeetingById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET MEETING BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create meeting
const createMeeting = async (req, res) => {
  try {
    const {
      company_id,
      title,
      start_date,
      start_time,
      end_time,
      attendees,
      location,
      reminder,
      note,
      created_by,
    } = req.body;

    if (
      !company_id ||
      !title ||
      !start_date ||
      !start_time ||
      !end_time ||
      !attendees
    ) {
      return res.status(400).json({
        success: false,
        message:
          "company_id, title, start_date, start_time, end_time and attendees are required",
      });
    }

    const data = await repo.createMeeting(
      company_id,
      title,
      start_date,
      start_time,
      end_time,
      attendees,
      location || null,
      reminder || null,
      note || null,
      created_by || null
    );

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data,
    });
  } catch (error) {
    console.error("CREATE MEETING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update meeting
const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      start_date,
      start_time,
      end_time,
      attendees,
      location,
      reminder,
      note,
    } = req.body;

    if (!title || !start_date || !start_time || !end_time || !attendees) {
      return res.status(400).json({
        success: false,
        message:
          "title, start_date, start_time, end_time and attendees are required",
      });
    }

    const existingMeeting = await repo.getMeetingById(id);

    if (!existingMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const data = await repo.updateMeeting(
      id,
      title,
      start_date,
      start_time,
      end_time,
      attendees,
      location || null,
      reminder || null,
      note || null
    );

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE MEETING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete meeting
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMeeting = await repo.getMeetingById(id);

    if (!existingMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const data = await repo.deleteMeeting(id);

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
      data,
    });
  } catch (error) {
    console.error("DELETE MEETING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMeetingsByCompanyId,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};