const getAllLeads = `
SELECT 
  l.*,
  c.company_name,
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
FROM leads l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN lead_owners lo ON l.id = lo.lead_id
LEFT JOIN users u ON u.id = lo.user_id
GROUP BY l.id, c.company_name
ORDER BY l.created_at DESC;
`;

const getAllLeadsByUserId = `
SELECT 
  l.*,
  c.company_name,
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
FROM leads l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN lead_owners lo ON l.id = lo.lead_id
LEFT JOIN users u ON u.id = lo.user_id
WHERE l.id IN (
  SELECT lead_id
  FROM lead_owners
  WHERE user_id = $1
)
GROUP BY l.id, c.company_name
ORDER BY l.created_at DESC;
`;

const getLeadsById = `
SELECT 
  l.*,
  c.company_name,
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
FROM leads l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN lead_owners lo ON l.id = lo.lead_id
LEFT JOIN users u ON u.id = lo.user_id
WHERE l.id = $1
GROUP BY l.id, c.company_name;
`;

const getLeadByIdForUser = `
SELECT 
  l.*,
  c.company_name,
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
FROM leads l
LEFT JOIN companies c ON l.company_id = c.id
LEFT JOIN lead_owners lo ON l.id = lo.lead_id
LEFT JOIN users u ON u.id = lo.user_id
WHERE l.id = $1
AND l.id IN (
  SELECT lead_id
  FROM lead_owners
  WHERE user_id = $2
)
GROUP BY l.id, c.company_name;
`;

const createLeads = `
INSERT INTO leads
(first_name, last_name, email, phone_number, job_title, city, company_id, status, is_converted)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;
`;

const updateLeads = `
UPDATE leads 
SET first_name = $1,
    last_name = $2,
    email = $3,
    phone_number = $4,
    job_title = $5,
    city = $6,
    company_id = $7,
    status = $8,
    is_converted = $9,
    updated_at = NOW()
WHERE id = $10
RETURNING *;
`;

const insertLeadOwner = `
INSERT INTO lead_owners (lead_id, user_id)
VALUES ($1, $2);
`;

const deleteLeadOwnersByLeadId = `
DELETE FROM lead_owners
WHERE lead_id = $1;
`;

const checkleadsExistById = `SELECT * FROM leads WHERE id = $1`;

const deleteLeads = `DELETE FROM leads WHERE id = $1 RETURNING *`;

module.exports = {
  getAllLeads,
  getAllLeadsByUserId,
  getLeadsById,
  getLeadByIdForUser,
  createLeads,
  updateLeads,
  insertLeadOwner,
  deleteLeadOwnersByLeadId,
  checkleadsExistById,
  deleteLeads
};