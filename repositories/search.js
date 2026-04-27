const pool = require("../config/db");
const queries = require("../queries/search");

const globalSearch = async (searchText) => {
  const value = `%${searchText}%`;

  const [
    leadsResult,
    dealsResult,
    companiesResult,
    ticketsResult,
    notesResult,
    tasksResult,
    emailsResult,
    meetingsResult,
  ] = await Promise.all([
    pool.query(queries.searchLeads, [value]),
    pool.query(queries.searchDeals, [value]),
    pool.query(queries.searchCompanies, [value]),
    pool.query(queries.searchTickets, [value]),
    pool.query(queries.searchNotes, [value]),
    pool.query(queries.searchTasks, [value]),
    pool.query(queries.searchEmails, [value]),
    pool.query(queries.searchMeetings, [value]),
  ]);

  return [
    ...leadsResult.rows,
    ...dealsResult.rows,
    ...companiesResult.rows,
    ...ticketsResult.rows,
    ...notesResult.rows,
    ...tasksResult.rows,
    ...emailsResult.rows,
    ...meetingsResult.rows,
  ];
};

module.exports = {
  globalSearch,
};