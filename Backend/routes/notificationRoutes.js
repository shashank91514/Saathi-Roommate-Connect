const express = require("express");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET /api/notifications

router.get(
  "/",
  authMiddleware,
  getNotifications
);


// PUT /api/notifications/:id/read

router.put(
  "/:id/read",
  authMiddleware,
  markAsRead
);


// PUT /api/notifications/read-all

router.put(
  "/read-all",
  authMiddleware,
  markAllAsRead
);


module.exports = router;