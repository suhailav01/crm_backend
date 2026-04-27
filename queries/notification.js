const createNotification = `
  INSERT INTO notifications (
    title,
    message,
    type,
    module,
    record_id,
    action_type,
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

const getAllNotifications = `
  SELECT
    n.*,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
  FROM notifications n
  LEFT JOIN users u ON n.created_by = u.id
  ORDER BY n.created_at DESC
  LIMIT 20;
`;

const getUnreadNotificationsCount = `
  SELECT COUNT(*) AS unread_count
  FROM notifications
  WHERE is_read = false;
`;

const markNotificationAsRead = `
  UPDATE notifications
  SET is_read = true
  WHERE id = $1
  RETURNING *;
`;

const markAllNotificationsAsRead = `
  UPDATE notifications
  SET is_read = true
  WHERE is_read = false
  RETURNING *;
`;

module.exports = {
  createNotification,
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};