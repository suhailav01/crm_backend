const pool = require("../config/db");
const queries = require("../queries/tickets");

// get all tickets
const getAllTickets = () => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getAllTickets, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

const getAllTicketsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getAllTicketsByUserId, [userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

const getTicketByIdForUser = (id, userId) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getTicketByIdForUser, [id, userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// get single ticket
const getTicketById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getTicketById, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// create ticket
const createTicket = async (
  ticket_name,
  description,
  status,
  source,
  priority,
  phone_number,
  deal_id,
  company_id,
  owners
) => {
  try {
    const result = await pool.query(queries.createTicket, [
      ticket_name,
      description,
      status,
      source,
      priority,
      phone_number,
      deal_id,
      company_id,
    ]);

    const ticketId = result.rows[0].id;

    // insert multiple owners
    if (owners && owners.length > 0) {
      for (let userId of owners) {
        await pool.query(
          "INSERT INTO ticket_owners (ticket_id, user_id) VALUES ($1, $2)",
          [ticketId, userId]
        );
      }
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// check exist by id
const checkTicketExistById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.getTicketById, [id], (error, result) => {
      if (error) {
        resolve(false);
      } else {
        resolve(result.rows.length > 0);
      }
    });
  });
};

// update ticket
const updateTickets = (
  ticket_name,
  description,
  status,
  source,
  priority,
  phone_number,
  deal_id,
  company_id,
  owners,
  id
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pool.query(queries.updateTicket, [
        ticket_name,
        description,
        status,
        source,
        priority,
        phone_number,
        deal_id,
        company_id,
        id,
      ]);

      // delete old owners
      await pool.query("DELETE FROM ticket_owners WHERE ticket_id = $1", [id]);

      // insert new owners
      if (owners && owners.length > 0) {
        for (let userId of owners) {
          await pool.query(
            "INSERT INTO ticket_owners (ticket_id, user_id) VALUES ($1, $2)",
            [id, userId]
          );
        }
      }

      resolve(result.rows);
    } catch (error) {
      console.log("DB ERROR:", error);
      reject(error);
    }
  });
};

// delete ticket
const deleteTickets = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(queries.deleteTicket, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  checkTicketExistById,
  updateTickets,
  deleteTickets,
  getAllTicketsByUserId,
  getTicketByIdForUser,
};