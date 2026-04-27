const repo = require("../repositories/search");

const globalSearch = async (req, res) => {
  try {
    const { query = "" } = req.query;

    if (!query.trim()) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const results = await repo.globalSearch(query);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("GLOBAL SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  globalSearch,
};