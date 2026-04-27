const dashboardRepo = require("../repositories/dashboard");

const getDashboardController = async (req, res) => {
  try {
    const dashboardData = await dashboardRepo.getDashboardData();

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardController,
};