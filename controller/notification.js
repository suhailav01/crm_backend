const repo = require("../repositories/notification");

const getAllNotifications = async (req, res) => {
  try {
    const data = await repo.getAllNotifications();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUnreadNotificationsCount = async (req, res) => {
  try {
    const data = await repo.getUnreadNotificationsCount();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET UNREAD COUNT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repo.markNotificationAsRead(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("MARK NOTIFICATION READ ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const data = await repo.markAllNotificationsAsRead();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("MARK ALL READ ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};