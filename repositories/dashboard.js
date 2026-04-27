const pool = require("../config/db");
const queries = require("../queries/dashboard");

const getDashboardData = async () => {
  const [
    summaryResult,
    conversionResult,
    salesReportResult,
    teamPerformanceResult,
  ] = await Promise.all([
    pool.query(queries.getDashboardSummary),
    pool.query(queries.getLeadConversion),
    pool.query(queries.getSalesReport),
    pool.query(queries.getTeamPerformance),
  ]);

  return {
    summary: summaryResult.rows[0] || {},
    conversion: conversionResult.rows[0] || {},
    sales_report: salesReportResult.rows || [],
    team_performance: teamPerformanceResult.rows || [],
  };
};

module.exports = {
  getDashboardData,
};