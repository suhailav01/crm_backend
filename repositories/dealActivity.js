
const pool = require("../config/db");
const queries = require("../queries/dealActivity");

const getActivityByDealId = async (dealId) => {
  const result = await pool.query(queries.getActivityByDealId, [dealId]);
  return result.rows;
};

module.exports = {
  getActivityByDealId
};