const repo = require("../repositories/leadsEmails");
const sendEmail = require("../utils/sendEmail");

// get emails by lead id
const getEmailsByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;

    const data = await repo.getEmailsByLeadsId(leadId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET EMAILS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch emails",
    });
  }
};

// get single email by id
const getEmailById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await repo.getEmailById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET EMAIL BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch email",
    });
  }
};

// create email + send real email
const createEmail = async (req, res) => {
  try {
    const {
      lead_id,
      recipients,
      cc,
      bcc,
      subject,
      body,
      sent_by,
    } = req.body;

    if (!lead_id || !recipients || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "lead_id, recipients, subject and body required",
      });
    }

    console.log("EMAIL REQUEST:", req.body);

    let emailStatus = "sent";

    // 1️⃣ Send Email
    try {
    const files = req.files || [];

await sendEmail({
  to: recipients,
  subject: subject,
  text: body,
  html: `<div style="font-family:Arial">${body.replace(/\n/g, "<br/>")}</div>`,
  cc: cc || undefined,
  bcc: bcc || undefined,

  attachments: files.map((file) => ({
    filename: file.originalname,
    path: file.path,
  })),
});

      console.log("EMAIL SENT SUCCESS");
    } catch (mailError) {
      console.error("EMAIL SEND FAILED:", mailError);
      emailStatus = "failed";
    }

    // 2️⃣ Save to database
    const data = await repo.createEmail({
      lead_id,
      recipients,
      cc: cc || null,
      bcc: bcc || null,
      subject,
      body,
      sent_by: sent_by || null,
    });

    res.status(201).json({
      success: true,
      emailStatus,
      message: "Email processed",
      data,
    });

  } catch (error) {
    console.error("CREATE EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update email
const updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipients, cc, bcc, subject, body } = req.body;

    if (!recipients || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "recipients, subject and body are required",
      });
    }

    const existingEmail = await repo.getEmailById(id);

    if (!existingEmail) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const data = await repo.updateEmail({
      id,
      recipients,
      cc: cc || null,
      bcc: bcc || null,
      subject,
      body,
    });
    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE EMAIL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update email",
    });
  }
};

// delete email
const deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const existingEmail = await repo.getEmailById(id);

    if (!existingEmail) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const data = await repo.deleteEmail(id);

    res.status(200).json({
      success: true,
      message: "Email deleted successfully",
      data,
    });
  } catch (error) {
    console.error("DELETE EMAIL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete email",
    });
  }
};

module.exports = {
  getEmailsByLeadId,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
};