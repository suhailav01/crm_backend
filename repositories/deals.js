const queries = require('../queries/deals');
const pool = require('../config/db');

// get all deals
const getAllDeals = () => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getAllDeals, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// get all deals by logged-in user
const getAllDealsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getAllDealsByUserId, [userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// get single deal
const getDealById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getDealById, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// get single deal only if user owns it
const getDealByIdForUser = (id, userId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getDealByIdForUser, [id, userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// get single lead
const getLeadById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getLeadById, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// convert lead
const convertLead = (leadId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.convertLead, [leadId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

// create deal + multiple owners
const createDeals = async (
  deal_name,
  lead_id,
  company_id,
  deal_stage,
  amount,
  close_date,
  priority,
  owners
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      queries.createDeal,
      [deal_name, lead_id, company_id, deal_stage, amount, close_date, priority]
    );

    const dealId = result.rows[0].id;

    if (owners && owners.length > 0) {
      for (let userId of owners) {
        await client.query(
          queries.insertDealOwner,
          [dealId, Number(userId)]
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
const checkDealExistById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id FROM deals WHERE id = $1",
      [id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows.length > 0);
        }
      }
    );
  });
};

// update deal + multiple owners
const updateDeal = async (
  id,
  deal_name,
  lead_id,
  company_id,
  deal_stage,
  amount,
  close_date,
  priority,
  owners
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      queries.updateDeal,
      [deal_name, lead_id, company_id, deal_stage, amount, close_date, priority, id]
    );

    await client.query(queries.deleteDealOwnersByDealId, [id]);

    if (owners && owners.length > 0) {
      for (let userId of owners) {
        await client.query(
          queries.insertDealOwner,
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

// delete deal
const deleteDeal = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.deleteDeal, [id], (error, result) => {
      if (error) {
        console.log("DELETE ERROR:", error);
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

module.exports = {
  getAllDeals,
  getAllDealsByUserId,
  getDealById,
  getDealByIdForUser,
  getLeadById,
  convertLead,
  createDeals,
  checkDealExistById,
  updateDeal,
  deleteDeal
};