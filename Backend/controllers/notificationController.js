const Notification = require("../models/Notification");

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    })
      .populate("sender", "name profileImage college")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    res.status(200).json({
      message: "Notifications fetched successfully",
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOne({
        _id: req.params.id,
        recipient: req.user.userId,
      });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error(
      "Mark Notification Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};