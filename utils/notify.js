const notificationRepo = require("../repositories/notification");

const sendNotification = async ({
  title,
  message,
  type,
  module,
  recordId,
  actionType,
  createdBy,
}) => {
  try {
    await notificationRepo.createNotification(
      title,
      message,
      type,
      module,
      recordId,
      actionType,
       Number(createdBy) || null
    );
  } catch (error) {
    console.error("SEND NOTIFICATION ERROR:", error.message);
  }
};

module.exports = sendNotification;