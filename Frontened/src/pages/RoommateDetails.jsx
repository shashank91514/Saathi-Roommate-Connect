import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./RoommateDetails.css";

function RoommateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roommate, setRoommate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // ======================================
  // FETCH ROOMMATE
  // ======================================

  useEffect(() => {
    const fetchRoommate = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await api.get(`/roommates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRoommate(response.data.roommate);
      } catch (err) {
        console.error("Fetch roommate error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load roommate profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoommate();
  }, [id]);

  // ======================================
  // SEND CONNECTION REQUEST
  // ======================================

  const handleConnect = async () => {
    try {
      setSending(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.post(
        `/connections/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Connection request sent successfully"
      );
    } catch (err) {
      console.error("Connection error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to send connection request"
      );
    } finally {
      setSending(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error && !roommate) {
    return (
      <div className="details-page">
        <div className="details-error">
          <div className="error-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="back-button"
            onClick={() => navigate("/Roommates")}
          >
            ← Back to Roommates
          </button>
        </div>
      </div>
    );
  }

  if (!roommate) {
    return null;
  }

  // ======================================
  // HELPERS
  // ======================================

  const getYearText = (year) => {
    if (!year) return "Not specified";

    if (year === 1) return "Year 1";
    if (year === 2) return "Year 2";
    if (year === 3) return "Year 3";
    if (year === 4) return "Year 4";

    return `Year ${year}`;
  };

  const getBooleanText = (value) => {
    return value ? "Yes" : "No";
  };

  const getBudgetText = () => {
    if (!roommate.budget || roommate.budget === 0) {
      return "Not specified";
    }

    return `₹${Number(roommate.budget).toLocaleString("en-IN")} / month`;
  };

  const compatibility =
    roommate.compatibility !== undefined
      ? roommate.compatibility
      : null;

  // ======================================
  // JSX
  // ======================================

  return (
    <div className="details-page">

      {/* ==================================
          BACK
      ================================== */}

      <div className="details-container">

        <button
          className="back-link"
          onClick={() => navigate("/Roommates")}
        >
          ← Back to Roommates
        </button>

        {/* ==================================
            PROFILE HEADER
        ================================== */}

        <section className="profile-header">

          <div className="profile-main">

            <div className="profile-avatar">

              {roommate.profileImage ? (
                <img
                  src={roommate.profileImage}
                  alt={roommate.name}
                />
              ) : (
                roommate.name?.charAt(0).toUpperCase()
              )}

            </div>

            <div className="profile-info">

              <h1>{roommate.name}</h1>

              <div className="profile-meta">

                <span>
                  🎓 {roommate.course || "Student"}
                </span>

                {roommate.college && (
                  <span className="meta-badge">
                    {roommate.college}
                  </span>
                )}

                {roommate.year && (
                  <span className="meta-badge">
                    {getYearText(roommate.year)}
                  </span>
                )}

              </div>

            </div>

          </div>

          <button
            className="connect-button"
            onClick={handleConnect}
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : "Connect with Saathi"}
          </button>

        </section>

        {/* ==================================
            SUCCESS / ERROR MESSAGE
        ================================== */}

        {message && (
          <div className="success-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && roommate && (
          <div className="inline-error">
            {error}
          </div>
        )}

        {/* ==================================
            ACADEMIC INFORMATION
        ================================== */}

        <section className="details-section">

          <div className="section-header">

            <div className="section-icon">
              🎓
            </div>

            <div className="section-heading">
              <h2>Academic Information</h2>
              <p>
                About their college and studies
              </p>
            </div>

          </div>

          <div className="academic-grid">

            <InfoCard
              icon="🏫"
              label="College"
              value={
                roommate.college ||
                "Not specified"
              }
            />

            <InfoCard
              icon="📚"
              label="Course"
              value={
                roommate.course ||
                "Not specified"
              }
            />

            <InfoCard
              icon="🗓️"
              label="Year"
              value={getYearText(roommate.year)}
            />

            <InfoCard
              icon="📍"
              label="City"
              value={
                roommate.city ||
                "Not specified"
              }
            />

            <InfoCard
              icon="💰"
              label="Monthly Budget"
              value={getBudgetText()}
            />

          </div>

        </section>

        {/* ==================================
            LIFESTYLE
        ================================== */}

        <section className="details-section">

          <div className="section-header">

            <div className="section-icon">
              ✨
            </div>

            <div className="section-heading">
              <h2>Lifestyle Preferences</h2>
              <p>
                See how your lifestyles might match
              </p>
            </div>

          </div>

          <div className="lifestyle-grid">

            <InfoCard
              icon="🍽️"
              label="Food"
              value={
                roommate.food ||
                "Not specified"
              }
            />

            <InfoCard
              icon="🚭"
              label="Smoking"
              value={getBooleanText(roommate.smoking)}
            />

            <InfoCard
              icon="🍺"
              label="Drinking"
              value={getBooleanText(roommate.drinking)}
            />

            <InfoCard
              icon="🌙"
              label="Sleep Schedule"
              value={
                roommate.sleepSchedule ||
                "Not specified"
              }
            />

            <InfoCard
              icon="🧹"
              label="Cleanliness"
              value={
                roommate.cleanliness ||
                "Not specified"
              }
            />

            <InfoCard
              icon="📖"
              label="Study Habit"
              value={
                roommate.studyHabit ||
                "Not specified"
              }
            />

          </div>

        </section>

        {/* ==================================
            ABOUT
        ================================== */}

        <section className="details-section about-section">

          <div className="section-header">

            <div className="section-icon">
              💬
            </div>

            <div className="section-heading">
              <h2>About</h2>
              <p>
                A little about this student
              </p>
            </div>

          </div>

          <div className="bio-box">

            {roommate.bio
              ? roommate.bio
              : "This student hasn't added a bio yet."}

          </div>

        </section>

        {/* ==================================
            COMPATIBILITY
        ================================== */}

        {compatibility !== null && (
          <section className="compatibility-section">

            <div className="compatibility-content">

              <div>

                <span className="compatibility-label">
                  ✨ Compatibility
                </span>

                <h2>
                  {compatibility}% Match
                </h2>

                <p>
                  Based on your lifestyle
                  preferences
                </p>

              </div>

              <div className="compatibility-circle">

                <span>
                  {compatibility}%
                </span>

              </div>

            </div>

            <div className="compatibility-bar">

              <div
                className="compatibility-progress"
                style={{
                  width: `${compatibility}%`,
                }}
              ></div>

            </div>

          </section>
        )}

        {/* ==================================
            CONNECT CTA
        ================================== */}

        <section className="connect-section">

          <div>

            <h2>
              Think you could be good roommates?
            </h2>

            <p>
              Send a connection request to start
              talking with {roommate.name}.
            </p>

          </div>

          <button
            className="connect-cta"
            onClick={handleConnect}
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : "Send Connection Request →"}
          </button>

        </section>

      </div>

    </div>
  );
}

// ======================================
// INFO CARD COMPONENT
// ======================================

function InfoCard({ icon, label, value }) {
  return (
    <div className="info-card">

      <div className="info-icon">
        {icon}
      </div>

      <div className="info-content">

        <span className="info-label">
          {label}
        </span>

        <strong className="info-value">
          {value}
        </strong>

      </div>

    </div>
  );
}

export default RoommateDetails;