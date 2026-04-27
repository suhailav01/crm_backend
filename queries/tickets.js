// tickets.queries.js

const getAllTickets = `
SELECT 
  t.*,
  d.deal_name,
  c.company_name,
  COALESCE(l.email, c.email) AS contact_email,
  COALESCE(l.phone_number, c.phone_number) AS contact_phone_number,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM tickets t
LEFT JOIN deals d ON t.deal_id = d.id
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON t.company_id = c.id
LEFT JOIN ticket_owners to2 ON to2.ticket_id = t.id
LEFT JOIN users u ON u.id = to2.user_id
GROUP BY 
  t.id, 
  d.deal_name, 
  c.company_name,
  l.email,
  l.phone_number,
  c.email,
  c.phone_number
ORDER BY t.created_at DESC;
`;

const getTicketById = `
SELECT 
  t.*,
  d.deal_name,
  c.company_name,
  COALESCE(l.email, c.email) AS contact_email,
  COALESCE(l.phone_number, c.phone_number) AS contact_phone_number,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM tickets t
LEFT JOIN deals d ON t.deal_id = d.id
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON t.company_id = c.id
LEFT JOIN ticket_owners to2 ON to2.ticket_id = t.id
LEFT JOIN users u ON u.id = to2.user_id
WHERE t.id = $1
GROUP BY 
  t.id, 
  d.deal_name, 
  c.company_name,
  l.email,
  l.phone_number,
  c.email,
  c.phone_number;
`;

const getAllTicketsByUserId = `
SELECT 
  t.*,
  d.deal_name,
  c.company_name,
  COALESCE(l.email, c.email) AS contact_email,
  COALESCE(l.phone_number, c.phone_number) AS contact_phone_number,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM tickets t
LEFT JOIN deals d ON t.deal_id = d.id
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON t.company_id = c.id
LEFT JOIN ticket_owners to2 ON to2.ticket_id = t.id
LEFT JOIN users u ON u.id = to2.user_id
WHERE t.id IN (
  SELECT ticket_id
  FROM ticket_owners
  WHERE user_id = $1
)
GROUP BY 
  t.id, 
  d.deal_name, 
  c.company_name,
  l.email,
  l.phone_number,
  c.email,
  c.phone_number
ORDER BY t.created_at DESC;
`;

const getTicketByIdForUser = `
SELECT 
  t.*,
  d.deal_name,
  c.company_name,
  COALESCE(l.email, c.email) AS contact_email,
  COALESCE(l.phone_number, c.phone_number) AS contact_phone_number,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM tickets t
LEFT JOIN deals d ON t.deal_id = d.id
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON t.company_id = c.id
LEFT JOIN ticket_owners to2 ON to2.ticket_id = t.id
LEFT JOIN users u ON u.id = to2.user_id
WHERE t.id = $1
AND t.id IN (
  SELECT ticket_id
  FROM ticket_owners
  WHERE user_id = $2
)
GROUP BY 
  t.id, 
  d.deal_name, 
  c.company_name,
  l.email,
  l.phone_number,
  c.email,
  c.phone_number;
`;

const createTicket = `
INSERT INTO tickets
(ticket_name, description, status, source, priority, phone_number, deal_id, company_id)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *;
`;

const updateTicket = `
UPDATE tickets
SET 
  ticket_name = $1,
  description = $2,
  status = $3,
  source = $4,
  priority = $5,
  phone_number = $6,
  deal_id = $7,
  company_id = $8,
  updated_at = CURRENT_TIMESTAMP
WHERE id = $9
RETURNING *;
`;

const deleteTicket = `
DELETE FROM tickets WHERE id = $1;
`;

const insertTicketOwner = `
INSERT INTO ticket_owners (ticket_id, user_id)
VALUES ($1, $2);
`;

const deleteTicketOwnersByTicketId = `
DELETE FROM ticket_owners
WHERE ticket_id = $1;
`;

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  insertTicketOwner,
  deleteTicketOwnersByTicketId,
  getAllTicketsByUserId,
  getTicketByIdForUser,
};