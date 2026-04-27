// ✅ GET ALL COMPANIES WITH OWNERS
const getAllCompanies = `
SELECT 
  c.*,
  COALESCE(json_agg(u.*) FILTER (WHERE u.id IS NOT NULL), '[]') AS owners
FROM companies c
LEFT JOIN company_owners co ON c.id = co.company_id
LEFT JOIN users u ON u.id = co.user_id
GROUP BY c.id
ORDER BY c.id DESC;
`;

// ✅ GET COMPANY BY ID WITH OWNERS
const getCompaniesById = `
SELECT 
  c.*,
  COALESCE(json_agg(u.*) FILTER (WHERE u.id IS NOT NULL), '[]') AS owners
FROM companies c
LEFT JOIN company_owners co ON c.id = co.company_id
LEFT JOIN users u ON u.id = co.user_id
WHERE c.id = $1
GROUP BY c.id;
`;
const getAllCompaniesByUserId = `
SELECT 
  c.*,
  COALESCE(json_agg(u.*) FILTER (WHERE u.id IS NOT NULL), '[]') AS owners
FROM companies c
LEFT JOIN company_owners co ON c.id = co.company_id
LEFT JOIN users u ON u.id = co.user_id
WHERE c.id IN (
  SELECT company_id
  FROM company_owners
  WHERE user_id = $1
)
GROUP BY c.id
ORDER BY c.id DESC;
`;
const getCompanyByIdForUser = `
SELECT 
  c.*,
  COALESCE(json_agg(u.*) FILTER (WHERE u.id IS NOT NULL), '[]') AS owners
FROM companies c
LEFT JOIN company_owners co ON c.id = co.company_id
LEFT JOIN users u ON u.id = co.user_id
WHERE c.id = $1
AND c.id IN (
  SELECT company_id
  FROM company_owners
  WHERE user_id = $2
)
GROUP BY c.id;
`;
// ✅ CREATE COMPANY
const createCompany = `
INSERT INTO companies 
(company_name, email, phone_number, industry, city, country_region, no_of_employees, annual_revenue, domain_name)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;
`;

// ✅ UPDATE COMPANY
const updateCompany = `
UPDATE companies 
SET company_name = $1,
    email = $2,
    phone_number = $3,
    industry = $4,
    city = $5,
    country_region = $6,
    no_of_employees = $7,
    annual_revenue = $8,
    domain_name = $9
WHERE id = $10
RETURNING *;
`;

// ✅ INSERT COMPANY OWNER
const insertCompanyOwner = `
INSERT INTO company_owners (company_id, user_id)
VALUES ($1, $2);
`;

// ✅ DELETE COMPANY OWNERS BY COMPANY ID
const deleteCompanyOwnersByCompanyId = `
DELETE FROM company_owners
WHERE company_id = $1;
`;

// ✅ DELETE COMPANY
const deleteCompany = `
DELETE FROM companies WHERE id = $1;
`;

module.exports = {
  getAllCompanies,
  getCompaniesById,
  createCompany,
  updateCompany,
  insertCompanyOwner,
  deleteCompanyOwnersByCompanyId,
  deleteCompany,
  getAllCompaniesByUserId,
  getCompanyByIdForUser
};