import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/notifications.css";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <p className="notification-loading">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      <div className="notifications-container">

        {/* HEADER */}

        <div className="notifications-header">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="notification-title-row">

            <div>
              <h1>Notifications</h1>

              <p>
                Stay updated with your connection activity.
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="unread-count">
                {unreadCount} unread
              </span>
            )}

          </div>

        </div>


        {/* ACTION BAR */}

        {notifications.length > 0 && (
          <div className="notification-actions">

            <span>
              {notifications.length} notifications
            </span>

            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}

          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="notification-error">
            <span>⚠️</span>

            <div>
              <strong>
                Unable to load notifications
              </strong>

              <p>{error}</p>
            </div>

            <button onClick={fetchNotifications}>
              Retry
            </button>
          </div>
        )}


        {/* EMPTY */}

        {!error && notifications.length === 0 && (
          <div className="empty-notifications">

            <div className="empty-bell">
              🔔
            </div>

            <h2>No notifications yet</h2>

            <p>
              Connection requests and responses
              will appear here.
            </p>

            <button
              onClick={() => navigate("/roommates")}
            >
              Find Roommates
            </button>

          </div>
        )}


        {/* NOTIFICATIONS */}

        {!error && notifications.length > 0 && (
          <div className="notification-list">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                className={`notification-card ${
                  notification.isRead
                    ? "notification-read"
                    : "notification-unread"
                }`}
                onClick={() =>
                  !notification.isRead &&
                  markAsRead(notification._id)
                }
              >

                <div className="notification-icon">
                  {notification.type ===
                  "connection_request"
                    ? "👋"
                    : notification.type ===
                      "connection_accepted"
                    ? "🤝"
                    : notification.type ===
                      "connection_rejected"
                    ? "❌"
                    : "🔔"}
                </div>

                <div className="notification-content">

                  <div className="notification-card-top">

                    <h3>
                      {notification.type ===
                      "connection_request"
                        ? "New Connection Request"
                        : notification.type ===
                          "connection_accepted"
                        ? "Connection Accepted"
                        : notification.type ===
                          "connection_rejected"
                        ? "Connection Rejected"
                        : "Notification"}
                    </h3>

                    {!notification.isRead && (
                      <span className="new-badge">
                        NEW
                      </span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="notification-time">
                    {notification.createdAt
                      ? new Date(
                          notification.createdAt
                        ).toLocaleString()
                      : ""}
                  </span>

                </div>

                {!notification.isRead && (
                  <span className="unread-dot"></span>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Notifications;