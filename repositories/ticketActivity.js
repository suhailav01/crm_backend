const pool = require("../config/db");
const queries = require("../queries/ticketActivity");

const getActivityByTicketId = async (ticketId) => {
  const result = await pool.query(queries.getActivityByTicketId, [ticketId]);
  return result.rows;
};

module.exports = {
  getActivityByTicketId,
};