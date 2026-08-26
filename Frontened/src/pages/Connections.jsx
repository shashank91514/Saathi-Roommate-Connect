import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/connections.css";

function Connections() {
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // GET CONNECTIONS
  // ==========================================

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConnections(response.data.connections || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load connections"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACCEPT REQUEST
  // ==========================================

  const acceptRequest = async (connectionId) => {
    try {
      setActionLoading(connectionId);

      const token = localStorage.getItem("token");

      await api.put(
        `/connections/${connectionId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConnections((prev) =>
        prev.map((connection) =>
          connection._id === connectionId
            ? {
                ...connection,
                status: "accepted",
              }
            : connection
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to accept request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // REJECT REQUEST
  // ==========================================

  const rejectRequest = async (connectionId) => {
    try {
      setActionLoading(connectionId);

      const token = localStorage.getItem("token");

      await api.put(
        `/connections/${connectionId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConnections((prev) =>
        prev.map((connection) =>
          connection._id === connectionId
            ? {
                ...connection,
                status: "rejected",
              }
            : connection
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // GET CURRENT USER ID
  // ==========================================

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return null;

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.userId;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // ==========================================
  // CATEGORIZE CONNECTIONS
  // ==========================================

  const incomingRequests = connections.filter(
    (connection) =>
      connection.receiver?._id === currentUserId &&
      connection.status === "pending"
  );

  const sentRequests = connections.filter(
    (connection) =>
      connection.sender?._id === currentUserId &&
      connection.status === "pending"
  );

  const acceptedConnections = connections.filter(
    (connection) =>
      connection.status === "accepted"
  );

  const rejectedRequests = connections.filter(
    (connection) =>
      connection.status === "rejected"
  );

  // ==========================================
  // GET OTHER USER
  // ==========================================

  const getOtherUser = (connection) => {
    if (
      connection.sender?._id === currentUserId
    ) {
      return connection.receiver;
    }

    return connection.sender;
  };

  // ==========================================
  // USER CARD
  // ==========================================

  const UserCard = ({ connection, type }) => {
    const user = getOtherUser(connection);

    if (!user) return null;

    return (
      <div className="connection-card">

        <div className="connection-user">

          <div className="connection-avatar">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
              />
            ) : (
              user.name
                ?.charAt(0)
                ?.toUpperCase()
            )}
          </div>

          <div className="connection-info">

            <h3>{user.name}</h3>

            <p>
              {user.course || "Student"}
            </p>

            {user.college && (
              <p>
                🎓 {user.college}
              </p>
            )}

            {user.year && (
              <p>
                📚 Year {user.year}
              </p>
            )}

            {user.city && (
              <p>
                📍 {user.city}
              </p>
            )}

          </div>

        </div>

        {/* ==========================
            INCOMING
        ========================== */}

        {type === "incoming" && (
          <div className="connection-actions">

            <button
              className="accept-button"
              disabled={
                actionLoading === connection._id
              }
              onClick={() =>
                acceptRequest(connection._id)
              }
            >
              {actionLoading === connection._id
                ? "..."
                : "Accept"}
            </button>

            <button
              className="reject-button"
              disabled={
                actionLoading === connection._id
              }
              onClick={() =>
                rejectRequest(connection._id)
              }
            >
              Reject
            </button>

          </div>
        )}

        {/* ==========================
            SENT
        ========================== */}

        {type === "sent" && (
          <span className="status-badge pending-badge">
            🟡 Pending
          </span>
        )}

        {/* ==========================
            ACCEPTED
        ========================== */}

        {type === "accepted" && (
          <div className="connection-status-actions">

            <span className="status-badge accepted-badge">
              🟢 Connected
            </span>

            <button
              className="profile-button"
              onClick={() =>
                navigate(
                  `/roommates/${user._id}`
                )
              }
            >
              View Profile
            </button>

          </div>
        )}

        {/* ==========================
            REJECTED
        ========================== */}

        {type === "rejected" && (
          <span className="status-badge rejected-badge">
            🔴 Rejected
          </span>
        )}

      </div>
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="connections-page">

        <div className="connections-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading connections...
          </h2>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="connections-page">

      <div className="connections-container">

        {/* HEADER */}

        <div className="connections-header">

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <div>
            <h1>My Connections</h1>

            <p>
              Manage your roommate requests
              and connections.
            </p>
          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="connections-error">

            <p>{error}</p>

            <button onClick={fetchConnections}>
              Try Again
            </button>

          </div>
        )}


        {!error && (
          <>

            {/* ==================================
                INCOMING REQUESTS
            ================================== */}

            <section className="connection-section">

              <div className="section-title">

                <div>
                  <h2>
                    Incoming Requests
                  </h2>

                  <p>
                    Students who want to connect
                    with you.
                  </p>
                </div>

                <span className="count-badge">
                  {incomingRequests.length}
                </span>

              </div>

              {incomingRequests.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-icon">
                    📭
                  </div>

                  <h3>
                    No pending requests
                  </h3>

                  <p>
                    New roommate requests will
                    appear here.
                  </p>

                </div>
              ) : (
                <div className="connections-grid">

                  {incomingRequests.map(
                    (connection) => (
                      <UserCard
                        key={connection._id}
                        connection={connection}
                        type="incoming"
                      />
                    )
                  )}

                </div>
              )}

            </section>


            {/* ==================================
                MY CONNECTIONS
            ================================== */}

            <section className="connection-section">

              <div className="section-title">

                <div>
                  <h2>
                    My Connections
                  </h2>

                  <p>
                    Your accepted roommate
                    connections.
                  </p>
                </div>

                <span className="count-badge">
                  {acceptedConnections.length}
                </span>

              </div>

              {acceptedConnections.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-icon">
                    🤝
                  </div>

                  <h3>
                    No connections yet
                  </h3>

                  <p>
                    Accept a request or find a
                    roommate to connect.
                  </p>

                  <button
                    className="find-button"
                    onClick={() =>
                      navigate("/roommates")
                    }
                  >
                    Find Roommates
                  </button>

                </div>
              ) : (
                <div className="connections-grid">

                  {acceptedConnections.map(
                    (connection) => (
                      <UserCard
                        key={connection._id}
                        connection={connection}
                        type="accepted"
                      />
                    )
                  )}

                </div>
              )}

            </section>


            {/* ==================================
                SENT REQUESTS
            ================================== */}

            <section className="connection-section">

              <div className="section-title">

                <div>
                  <h2>
                    Sent Requests
                  </h2>

                  <p>
                    Requests waiting for a
                    response.
                  </p>
                </div>

                <span className="count-badge">
                  {sentRequests.length}
                </span>

              </div>

              {sentRequests.length === 0 ? (
                <div className="empty-state small">

                  <div className="empty-icon small-icon">
                    📤
                  </div>

                  <h3>
                    No pending sent requests
                  </h3>

                  <p>
                    Requests you send will
                    appear here.
                  </p>

                </div>
              ) : (
                <div className="connections-grid">

                  {sentRequests.map(
                    (connection) => (
                      <UserCard
                        key={connection._id}
                        connection={connection}
                        type="sent"
                      />
                    )
                  )}

                </div>
              )}

            </section>


            {/* ==================================
                REQUEST HISTORY
            ================================== */}

            <section className="connection-section">

              <div className="section-title">

                <div>
                  <h2>
                    Request History
                  </h2>

                  <p>
                    Previously rejected connection
                    requests.
                  </p>
                </div>

                <span className="count-badge">
                  {rejectedRequests.length}
                </span>

              </div>

              {rejectedRequests.length === 0 ? (
                <div className="empty-state small">

                  <div className="empty-icon small-icon">
                    🗂️
                  </div>

                  <h3>
                    No rejected requests
                  </h3>

                  <p>
                    Your rejected requests will
                    appear here.
                  </p>

                </div>
              ) : (
                <div className="connections-grid">

                  {rejectedRequests.map(
                    (connection) => (
                      <UserCard
                        key={connection._id}
                        connection={connection}
                        type="rejected"
                      />
                    )
                  )}

                </div>
              )}

            </section>

          </>
        )}

      </div>

    </div>
  );
}

export default Connections;