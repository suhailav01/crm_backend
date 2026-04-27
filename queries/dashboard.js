const getDashboardSummary = `
  SELECT
    (SELECT COUNT(*) FROM leads) AS total_leads,
    (
      SELECT COUNT(*)
      FROM deals
      WHERE deal_stage IN ('Proposal Sent', 'Negotiation')
    ) AS active_deals,
    (
      SELECT COUNT(*)
      FROM deals
      WHERE deal_stage IN ('Closed Won', 'Closed Lost')
    ) AS closed_deals,
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM deals
      WHERE deal_stage = 'Closed Won'
        AND close_date IS NOT NULL
        AND DATE_TRUNC('month', close_date) = DATE_TRUNC('month', CURRENT_DATE)
    ) AS monthly_revenue
`;

const getLeadConversion = `
  SELECT
    (SELECT COUNT(*) FROM leads WHERE status = 'New') AS contact,
    (SELECT COUNT(*) FROM leads WHERE status = 'Qualified') AS qualified_lead,
    (SELECT COUNT(*) FROM deals WHERE deal_stage = 'Proposal Sent') AS proposal_sent,
    (SELECT COUNT(*) FROM deals WHERE deal_stage = 'Negotiation') AS negotiation,
    (SELECT COUNT(*) FROM deals WHERE deal_stage = 'Closed Won') AS closed_won,
    (SELECT COUNT(*) FROM deals WHERE deal_stage = 'Closed Lost') AS closed_lost
`;

const getSalesReport = `
  SELECT
    EXTRACT(MONTH FROM close_date)::int AS month_number,
    TO_CHAR(close_date, 'Mon') AS month,
    COALESCE(SUM(amount), 0) AS total
  FROM deals
  WHERE deal_stage = 'Closed Won'
    AND close_date IS NOT NULL
  GROUP BY EXTRACT(MONTH FROM close_date), TO_CHAR(close_date, 'Mon')
  ORDER BY EXTRACT(MONTH FROM close_date)
`;

const getTeamPerformance = `
  SELECT
    u.id,
    CONCAT(u.first_name, ' ', u.last_name) AS employee,
    COUNT(DISTINCT d.id) FILTER (
      WHERE d.deal_stage IN ('Proposal Sent', 'Negotiation')
    ) AS active_deals,
    COUNT(DISTINCT d.id) FILTER (
      WHERE d.deal_stage IN ('Closed Won', 'Closed Lost')
    ) AS closed_deals,
    COALESCE(
      SUM(d.amount) FILTER (
        WHERE d.deal_stage = 'Closed Won'
        AND d.close_date IS NOT NULL
      ),
      0
    ) AS revenue
  FROM users u
  LEFT JOIN deal_owners do2 ON do2.user_id = u.id
  LEFT JOIN deals d ON d.id = do2.deal_id
  GROUP BY u.id, u.first_name, u.last_name
  ORDER BY revenue DESC
`;

module.exports = {
  getDashboardSummary,
  getLeadConversion,
  getSalesReport,
  getTeamPerformance,
};