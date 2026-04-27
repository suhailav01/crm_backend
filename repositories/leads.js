const queries = require('../queries/leads');
const pool = require('../config/db');

// get all leads
const getAllLeads = () => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getAllLeads, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};

// get all leads by logged-in user
const getAllLeadsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getAllLeadsByUserId, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};

// get single lead
const getLeadsById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getLeadsById, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// get single lead only if user owns it
const getLeadByIdForUser = (id, userId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getLeadByIdForUser, [id, userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// create lead + multiple owners
const createLeads = async (
  first_name,
  last_name,
  email,
  phone_number,
  job_title,
  city,
  company_id,
  status,
  is_converted,
  owners
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      queries.createLeads,
      [
        first_name,
        last_name,
        email,
        phone_number,
        job_title,
        city,
        company_id,
        status,
        is_converted
      ]
    );

    const leadId = result.rows[0].id;

    if (owners && owners.length > 0) {
      for (let userId of owners) {
        await client.query(
          queries.insertLeadOwner,
          [leadId, Number(userId)]
        );
      }
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// check exist by id
const checkleadsExistById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.checkleadsExistById, [id], (error, result) => {
      if (error) {
        resolve(false);
      } else {
        resolve(result.rows.length > 0);
      }
    });
  });
};

// update lead + multiple owners
const updateLeads = async (
  id,
  first_name,
  last_name,
  email,
  phone_number,
  job_title,
  city,
  company_id,
  status,
  is_converted,
  owners
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      queries.updateLeads,
      [
        first_name,
        last_name,
        email,
        phone_number,
        job_title,
        city,
        company_id,
        status,
        is_converted,
        id
      ]
    );

    await client.query(queries.deleteLeadOwnersByLeadId, [id]);

    if (owners && owners.length > 0) {
      for (let userId of owners) {
        await client.query(
          queries.insertLeadOwner,
          [id, Number(userId)]
        );
      }
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// delete lead
const deleteLeads = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.deleteLeads, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

module.exports = {
  getAllLeads,
  getAllLeadsByUserId,
  getLeadsById,
  getLeadByIdForUser,
  createLeads,
  checkleadsExistById,
  updateLeads,
  deleteLeads
};