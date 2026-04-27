const express = require("express");
const router = express.Router();
const controller = require("../controller/notification");

router.get("/", controller.getAllNotifications);
router.get("/unread-count", controller.getUnreadNotificationsCount);
router.put("/:id/read", controller.markNotificationAsRead);
router.put("/read-all", controller.markAllNotificationsAsRead);

module.exports = router;