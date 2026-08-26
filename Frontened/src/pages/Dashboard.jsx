import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notification count
  const [unreadCount, setUnreadCount] = useState(0);

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchRoommates();
    fetchUnreadNotifications();

    // Check notifications every 30 seconds
    const notificationInterval = setInterval(() => {
      fetchUnreadNotifications();
    }, 30000);

    return () => {
      clearInterval(notificationInterval);
    };
  }, [navigate]);

  // ==========================================
  // FETCH ROOMMATES
  // ==========================================

  const fetchRoommates = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/roommates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoommates(response.data.roommates || []);
    } catch (error) {
      console.error(
        "Unable to load roommates:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH UNREAD NOTIFICATIONS
  // ==========================================

  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "Unable to load notifications:",
        error
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-card">
          <div className="loading-spinner"></div>

          <p>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="dashboard-navbar">

        <div className="dashboard-navbar-inner">

          <div
            className="dashboard-logo"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Saathi
          </div>

          <div className="dashboard-nav-links">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="nav-active"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/roommates")
              }
            >
              Find Roommates
            </button>

            <button
              onClick={() =>
                navigate("/connections")
              }
            >
              Connections
            </button>

            {/* ==================================
                NOTIFICATIONS
            ================================== */}

            <button
              onClick={() =>
                navigate("/notifications")
              }
              className="notification-nav-button"
            >
              <span className="notification-content">
                🔔 Notifications

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/profile")
              }
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-container">

        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <p className="welcome-label">
              Welcome back 👋
            </p>

            <h1>
              Hello, {user?.name || "Student"}!
            </h1>

            <p className="welcome-description">
              Find a roommate who matches your
              lifestyle, budget and preferences.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/roommates")
            }
          >
            Find Roommates
          </button>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              Quick Actions
            </h2>

            <p>
              Everything you need to find your
              perfect roommate.
            </p>

          </div>


          <div className="action-grid">

            {/* Find Roommates */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/roommates")
              }
            >
              <div className="action-icon">
                👥
              </div>

              <h3>
                Find Roommates
              </h3>

              <p>
                Discover students looking for
                compatible roommates.
              </p>

              <span>
                Explore →
              </span>
            </div>


            {/* Connections */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/connections")
              }
            >
              <div className="action-icon">
                🤝
              </div>

              <h3>
                My Connections
              </h3>

              <p>
                Manage your roommate requests
                and connections.
              </p>

              <span>
                View Connections →
              </span>
            </div>


            {/* Notifications */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/notifications")
              }
            >
              <div className="action-icon notification-action-icon">
                🔔
              </div>

              <h3>
                Notifications

                {unreadCount > 0 && (
                  <span className="quick-action-badge">
                    {unreadCount}
                  </span>
                )}
              </h3>

              <p>
                See connection requests and
                updates about your account.
              </p>

              <span>
                View Notifications →
              </span>
            </div>


            {/* Profile */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/profile")
              }
            >
              <div className="action-icon">
                👤
              </div>

              <h3>
                My Profile
              </h3>

              <p>
                Update your lifestyle and
                roommate preferences.
              </p>

              <span>
                Edit Profile →
              </span>
            </div>

          </div>

        </section>


        {/* PROFILE SUMMARY */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              Your Profile
            </h2>

            <p>
              Keep your preferences updated to
              get better roommate matches.
            </p>

          </div>

          <div className="profile-summary-card">

            <div className="profile-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "S"}
            </div>

            <div className="profile-summary-info">

              <h3>
                {user?.name || "Student"}
              </h3>

              <p>
                {user?.college ||
                  "College not added"}
              </p>

              <p>
                {user?.email ||
                  "Email not available"}
              </p>

            </div>

            <button
              className="outline-button"
              onClick={() =>
                navigate("/profile")
              }
            >
              Edit Profile
            </button>

          </div>

        </section>


        {/* ROOMMATE SUGGESTIONS */}

        <section className="dashboard-section">

          <div className="section-heading-row">

            <div>

              <h2>
                Roommate Suggestions
              </h2>

              <p>
                Students you may be compatible
                with.
              </p>

            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate("/roommates")
              }
            >
              View All →
            </button>

          </div>


          {roommates.length === 0 ? (

            <div className="empty-roommates">

              <div className="empty-icon">
                🔍
              </div>

              <h3>
                No roommates found yet
              </h3>

              <p>
                Complete your profile and start
                discovering potential roommates.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/roommates")
                }
              >
                Find Roommates
              </button>

            </div>

          ) : (

            <div className="roommate-grid">

              {roommates
                .slice(0, 3)
                .map((roommate) => (

                  <div
                    className="roommate-card"
                    key={roommate._id}
                  >

                    <div className="roommate-card-top">

                      <div className="roommate-avatar">

                        {roommate.name
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <h3>
                          {roommate.name}
                        </h3>

                        <p>
                          {roommate.college}
                        </p>

                      </div>

                    </div>

                    <div className="roommate-details">

                      <span>
                        📚 {roommate.course}
                      </span>

                      <span>
                        🎓 Year {roommate.year}
                      </span>

                      {roommate.city && (
                        <span>
                          📍 {roommate.city}
                        </span>
                      )}

                    </div>

                    <button
                      className="outline-button full-button"
                      onClick={() =>
                        navigate(
                          `/roommates/${roommate._id}`
                        )
                      }
                    >
                      View Profile
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;