const repo = require("../repositories/ticketActivity");

const getActivityByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const data = await repo.getActivityByTicketId(ticketId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET ACTIVITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getActivityByTicketId,
};