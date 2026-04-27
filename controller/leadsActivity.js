const repo = require("../repositories/leadsActivity");

const getActivityByLeadsId = async (req, res) => {
  try {
    const { leadId } = req.params;

    const data = await repo.getActivityByLeadsId(leadId);

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
  getActivityByLeadsId,
};