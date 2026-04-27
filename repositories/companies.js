const queries = require('../queries/companies');
const pool = require('../config/db');


// ✅ GET ALL COMPANIES
const getAllCompanies = () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getAllCompanies, (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};


// ✅ GET SINGLE COMPANY
const getCompanyById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getCompaniesById, [id], (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};

const getAllCompaniesByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getAllCompaniesByUserId, [userId], (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};

const getCompanyByIdForUser = (id, userId) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getCompanyByIdForUser, [id, userId], (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};


// ✅ CREATE COMPANY 
const createCompanies = (
    company_name,
    email,
    phone_number,
    industry,
    city,
    country_region,
    no_of_employees,
    annual_revenue,
    domain_name,
    owners
) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const result = await client.query(
                queries.createCompany,
                [
                    company_name,
                    email,
                    phone_number,
                    industry,
                    city,
                    country_region,
                    no_of_employees,
                    annual_revenue,
                    domain_name
                ]
            );

            const companyId = result.rows[0].id;

            for (let userId of owners) {
                await client.query(
                    "INSERT INTO company_owners(company_id, user_id) VALUES ($1, $2)",
                    [companyId, Number(userId)]
                );
            }

            await client.query("COMMIT");
            resolve(result.rows[0]);

        } catch (error) {
            await client.query("ROLLBACK");
            reject(error);
        } finally {
            client.release();
        }
    });
};


// ✅ CHECK EXIST
const checkCompanyExistById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getCompaniesById, [id], (error, result) => {
            if (error) resolve(false);
            else resolve(result.rows.length > 0);
        });
    });
};


// ✅ UPDATE COMPANY + OWNERS
const updateCompanies = (
    id,
    company_name,
    email,
    phone_number,
    industry,
    city,
    country_region,
    no_of_employees,
    annual_revenue,
    owners ,
    domain_name
) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // 1. Update company
            const result = await client.query(
                queries.updateCompany,
                [
                    company_name,
                    email,
                    phone_number,
                    industry,
                    city,
                    country_region,
                    no_of_employees,
                    annual_revenue,
                    domain_name,
                    id
                ]
            );

            // 2. Delete old owners
            await client.query(
                "DELETE FROM company_owners WHERE company_id = $1",
                [id]
            );

            // 3. Insert new owners
            for (let userId of owners) {
                await client.query(
                    "INSERT INTO company_owners(company_id, user_id) VALUES ($1, $2)",
                    [id, userId]
                );
            }

            await client.query("COMMIT");

            resolve(result.rows[0]);

        } catch (error) {
            await client.query("ROLLBACK");
            reject(error);
        } finally {
            client.release();
        }
    });
};


// ✅ DELETE COMPANY
const deleteCompanies = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.deleteCompany, [id], (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};


module.exports = {
    getAllCompanies,
    getCompanyById,
    createCompanies,
    checkCompanyExistById,
    updateCompanies,
    deleteCompanies,
    getAllCompaniesByUserId,
    getCompanyByIdForUser
};