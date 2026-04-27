const pool = require("../config/db");
const queries = require("../queries/notification");

const createNotification = async (
  title,
  message,
  type,
  module,
  recordId,
  actionType,
  createdBy
) => {
  const result = await pool.query(queries.createNotification, [
    title,
    message,
    type,
    module,
    recordId,
    actionType,
    createdBy,
  ]);

  return result.rows[0];
};

const getAllNotifications = async () => {
  const result = await pool.query(queries.getAllNotifications);
  return result.rows;
};

const getUnreadNotificationsCount = async () => {
  const result = await pool.query(queries.getUnreadNotificationsCount);
  return result.rows[0];
};

const markNotificationAsRead = async (id) => {
  const result = await pool.query(queries.markNotificationAsRead, [id]);
  return result.rows[0];
};

const markAllNotificationsAsRead = async () => {
  const result = await pool.query(queries.markAllNotificationsAsRead);
  return result.rows;
};

module.exports = {
  createNotification,
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};