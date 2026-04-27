const repo = require("../repositories/dealActivity");

const getActivityByDealId = async (req, res) => {
  try {
    const { dealId } = req.params;

    const data = await repo.getActivityByDealId(dealId);

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
  getActivityByDealId,
};