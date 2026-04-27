const pool = require("../config/db");
const queries = require("../queries/leadsActivity");

const getActivityByLeadsId = async (leadsId) => {
  const result = await pool.query(queries.getActivityByLeadsId, [leadsId]);
  return result.rows;
};

module.exports = {
  getActivityByLeadsId,
};