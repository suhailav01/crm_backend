const searchLeads = `
  SELECT
    id,
    CONCAT(first_name, ' ', last_name) AS title,
    email AS subtitle,
    'lead' AS type,
    'leads' AS module,
    id AS route_id
  FROM leads
  WHERE
    first_name ILIKE $1 OR
    last_name ILIKE $1 OR
    email ILIKE $1 OR
    phone_number ILIKE $1 OR
    job_title ILIKE $1 OR
    status ILIKE $1
`;

const searchDeals = `
  SELECT
    d.id,
    d.deal_name AS title,
    CONCAT(
      'Stage: ', d.deal_stage,
      ' | Lead: ', COALESCE(l.first_name || ' ' || l.last_name, 'No Lead'),
      ' | Owner: ', COALESCE(u.first_name || ' ' || u.last_name, 'No Owner')
    ) AS subtitle,
    'deal' AS type,
    'deals' AS module,
    d.id AS route_id
  FROM deals d
  LEFT JOIN leads l ON d.lead_id = l.id
  LEFT JOIN users u ON d.deal_owner = u.id
  WHERE
    d.deal_name ILIKE $1 OR
    d.deal_stage ILIKE $1 OR
    d.priority ILIKE $1 OR
    d.amount::text ILIKE $1 OR
    d.close_date::text ILIKE $1 OR
    l.first_name ILIKE $1 OR
    l.last_name ILIKE $1 OR
    u.first_name ILIKE $1 OR
    u.last_name ILIKE $1
  ORDER BY d.created_at DESC
  LIMIT 5
`;

const searchCompanies = `
  SELECT
    id,
    company_name AS title,
    email AS subtitle,
    'company' AS type,
    'companies' AS module,
    id AS route_id
  FROM companies
  WHERE
    company_name ILIKE $1 OR
    email ILIKE $1 OR
    phone_number ILIKE $1 OR
    industry ILIKE $1 OR
    city ILIKE $1 OR
    country_region ILIKE $1
`;

const searchTickets = `
  SELECT
    id,
    ticket_name AS title,
    description AS subtitle,
    'ticket' AS type,
    'tickets' AS module,
    id AS route_id
  FROM tickets
  WHERE
    ticket_name ILIKE $1 OR
    description ILIKE $1 OR
    status ILIKE $1 OR
    priority ILIKE $1 OR
    source ILIKE $1
`;

const searchNotes = `
  SELECT
    tn.id,
    tn.note_text AS title,
    CONCAT(
      'Ticket Note - Ticket ID: ',
      tn.ticket_id,
      ' | By: ',
      COALESCE(u.first_name || ' ' || u.last_name, 'Unknown User')
    ) AS subtitle,
    'note' AS type,
    'tickets' AS module,
    tn.ticket_id AS route_id
  FROM ticket_notes tn
  LEFT JOIN users u ON tn.created_by = u.id
  WHERE
    tn.note_text ILIKE $1 OR
    u.first_name ILIKE $1 OR
    u.last_name ILIKE $1
  ORDER BY tn.created_at DESC
  LIMIT 5
`;

const searchTasks = `
  SELECT
    tt.id,
    tt.task_name AS title,
    CONCAT(
      'Ticket Task - Ticket ID: ',
      tt.ticket_id,
      ' | Assigned To: ',
      COALESCE(au.first_name || ' ' || au.last_name, 'Unassigned'),
      ' | Status: ',
      COALESCE(tt.status, 'No Status')
    ) AS subtitle,
    'task' AS type,
    'tickets' AS module,
    tt.ticket_id AS route_id
  FROM ticket_tasks tt
  LEFT JOIN users au ON tt.assigned_to = au.id
  LEFT JOIN users cu ON tt.created_by = cu.id
  WHERE
    tt.task_name ILIKE $1 OR
    tt.note ILIKE $1 OR
    tt.priority ILIKE $1 OR
    tt.task_type ILIKE $1 OR
    tt.status ILIKE $1 OR
    au.first_name ILIKE $1 OR
    au.last_name ILIKE $1 OR
    cu.first_name ILIKE $1 OR
    cu.last_name ILIKE $1
  ORDER BY tt.created_at DESC
  LIMIT 5
`;

const searchEmails = `
  SELECT
    te.id,
    te.subject AS title,
    CONCAT(
      'Ticket Email - Ticket ID: ',
      te.ticket_id,
      ' | Sent By: ',
      COALESCE(u.first_name || ' ' || u.last_name, 'Unknown User')
    ) AS subtitle,
    'email' AS type,
    'tickets' AS module,
    te.ticket_id AS route_id
  FROM ticket_emails te
  LEFT JOIN users u ON te.sent_by = u.id
  WHERE
    te.subject ILIKE $1 OR
    te.body ILIKE $1 OR
    te.recipients ILIKE $1 OR
    te.cc ILIKE $1 OR
    te.bcc ILIKE $1 OR
    u.first_name ILIKE $1 OR
    u.last_name ILIKE $1
  ORDER BY te.created_at DESC
  LIMIT 5
`;

const searchMeetings = `
  SELECT
    tm.id,
    tm.title AS title,
    CONCAT(
      'Ticket Meeting - Ticket ID: ',
      tm.ticket_id,
      ' | Location: ',
      COALESCE(tm.location, 'No Location'),
      ' | By: ',
      COALESCE(u.first_name || ' ' || u.last_name, 'Unknown User')
    ) AS subtitle,
    'meeting' AS type,
    'tickets' AS module,
    tm.ticket_id AS route_id
  FROM ticket_meetings tm
  LEFT JOIN users u ON tm.created_by = u.id
  WHERE
    tm.title ILIKE $1 OR
    tm.location ILIKE $1 OR
    tm.attendees ILIKE $1 OR
    tm.note ILIKE $1 OR
    tm.start_date::text ILIKE $1 OR
    tm.start_time::text ILIKE $1 OR
    tm.end_time::text ILIKE $1 OR
    u.first_name ILIKE $1 OR
    u.last_name ILIKE $1
  ORDER BY tm.created_at DESC
  LIMIT 5
`;

module.exports = {
  searchLeads,
  searchDeals,
  searchCompanies,
  searchTickets,
  searchNotes,
  searchTasks,
  searchEmails,
  searchMeetings,
};