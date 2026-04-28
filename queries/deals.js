const getAllDeals = `
SELECT 
  d.*,
  l.first_name,
  l.last_name,
  l.email AS lead_email,
  l.phone_number AS lead_phone_number,
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
FROM deals d
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON d.company_id = c.id
LEFT JOIN deal_owners do2 ON d.id = do2.deal_id
LEFT JOIN users u ON u.id = do2.user_id
GROUP BY d.id, l.first_name, l.last_name, l.email, l.phone_number, c.company_name
ORDER BY d.created_at DESC;
`;

const getDealById = `
SELECT  
  d.*,
  l.first_name,
  l.last_name,
  l.email AS lead_email,
  l.phone_number AS lead_phone_number,
  c.company_name,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'phone_number', u.phone_number
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM deals d
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON d.company_id = c.id
LEFT JOIN deal_owners do2 ON d.id = do2.deal_id
LEFT JOIN users u ON u.id = do2.user_id
WHERE d.id = $1
GROUP BY d.id, l.first_name, l.last_name, l.email, l.phone_number, c.company_name;`

const getAllDealsByUserId = `
SELECT 
  d.*,
  l.first_name,
  l.last_name,
  l.email AS lead_email,
  l.phone_number AS lead_phone_number,
  c.company_name,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'phone_number', u.phone_number
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM deals d
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON d.company_id = c.id
LEFT JOIN deal_owners do2 ON d.id = do2.deal_id
LEFT JOIN users u ON u.id = do2.user_id
WHERE d.id IN (
  SELECT deal_id
  FROM deal_owners
  WHERE user_id = $1
)
GROUP BY d.id, l.first_name, l.last_name, l.email, l.phone_number, c.company_name
ORDER BY d.created_at DESC;
`;

const getDealByIdForUser = `
SELECT  
  d.*,
  l.first_name,
  l.last_name,
  l.email AS lead_email,
  l.phone_number AS lead_phone_number,
  c.company_name,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'phone_number', u.phone_number
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS owners
FROM deals d
LEFT JOIN leads l ON d.lead_id = l.id
LEFT JOIN companies c ON d.company_id = c.id
LEFT JOIN deal_owners do2 ON d.id = do2.deal_id
LEFT JOIN users u ON u.id = do2.user_id
WHERE d.id = $1
AND d.id IN (
  SELECT deal_id
  FROM deal_owners
  WHERE user_id = $2
)
GROUP BY d.id, l.first_name, l.last_name, l.email, l.phone_number, c.company_name;
`;
const createDeal = `
INSERT INTO deals
(deal_name, lead_id, company_id, deal_stage, amount, close_date, priority)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;
`;

const updateDeal = `
UPDATE deals
SET 
  deal_name = $1,
  lead_id = $2,
  company_id = $3,
  deal_stage = $4,
  amount = $5,
  close_date = $6,
  priority = $7,
  updated_at = CURRENT_TIMESTAMP
WHERE id = $8
RETURNING *;
`;

const deleteDeal = `
DELETE FROM deals WHERE id = $1;
`;

const insertDealOwner = `
INSERT INTO deal_owners (deal_id, user_id)
VALUES ($1, $2);
`;

const deleteDealOwnersByDealId = `
DELETE FROM deal_owners
WHERE deal_id = $1;
`;

const getQualifiedLeads = `
SELECT id, first_name, last_name
FROM leads
WHERE status = 'Qualified' AND is_converted = false;
`;

const getLeadById = `
SELECT 
  l.*,
  c.company_name
FROM leads l
LEFT JOIN companies c ON l.company_id = c.id
WHERE l.id = $1;
`;

const convertLead = `
UPDATE leads 
SET status = 'Converted', is_converted = true 
WHERE id = $1;
`;

module.exports = {
  getAllDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  insertDealOwner,
  deleteDealOwnersByDealId,
  getQualifiedLeads,
  getLeadById,
  convertLead,
  getAllDealsByUserId,
  getDealByIdForUser
};