import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);

    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-loading">

        <div className="profile-spinner"></div>

        <p>
          Loading profile...
        </p>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="profile-page">

        <nav className="profile-navbar">

          <div
            className="profile-logo"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            🏠 Saathi
          </div>

        </nav>

        <main className="profile-container">

          <div className="profile-error">

            <div className="profile-error-icon">
              ⚠️
            </div>

            <h2>
              {error}
            </h2>

            <button
              onClick={fetchProfile}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>
    );
  }


  if (!user) {
    return null;
  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="profile-page">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="profile-navbar">

        <div
          className="profile-logo"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          🏠 Saathi
        </div>


        <div className="profile-nav-links">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
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

          <button className="active">
            Profile
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="profile-container">

        {/* Header */}

        <div className="profile-page-header">

          <p>
            SAATHI
          </p>

          <h1>
            My Profile
          </h1>

          <span>
            Manage your information and
            roommate preferences.
          </span>

        </div>


        {/* ====================================
            PROFILE HEADER CARD
        ==================================== */}

        <section className="profile-card profile-main-card">

          <div className="profile-main-info">

            <div className="profile-avatar">

              {user.profileImage ? (

                <img
                  src={user.profileImage}
                  alt={user.name}
                />

              ) : (

                <span>
                  {user.name
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </span>

              )}

            </div>


            <div>

              <h2>
                {user.name || "User"}
              </h2>

              <p>
                {user.course ||
                  "Course not specified"}
                {user.year &&
                  ` • Year ${user.year}`}
              </p>

              <p>
                🎓{" "}
                {user.college ||
                  "College not specified"}
              </p>

            </div>

          </div>


          <button
            className="edit-profile-btn"
            onClick={() =>
              navigate("/profile/edit")
            }
          >
            ✏️ Edit Profile
          </button>

        </section>


        {/* ====================================
            BASIC INFORMATION
        ==================================== */}

        <section className="profile-card">

          <div className="profile-section-header">

            <div>

              <h2>
                Basic Information
              </h2>

              <p>
                Your academic and location
                details.
              </p>

            </div>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">

              <small>
                College
              </small>

              <strong>
                {user.college ||
                  "Not specified"}
              </strong>

            </div>


            <div className="profile-info-item">

              <small>
                Course
              </small>

              <strong>
                {user.course ||
                  "Not specified"}
              </strong>

            </div>


            <div className="profile-info-item">

              <small>
                Year
              </small>

              <strong>
                {user.year
                  ? `Year ${user.year}`
                  : "Not specified"}
              </strong>

            </div>


            <div className="profile-info-item">

              <small>
                City
              </small>

              <strong>
                {user.city ||
                  "Not specified"}
              </strong>

            </div>


            <div className="profile-info-item">

              <small>
                Monthly Budget
              </small>

              <strong>
                {user.budget
                  ? `₹${user.budget}`
                  : "Not specified"}
              </strong>

            </div>


            <div className="profile-info-item">

              <small>
                Email
              </small>

              <strong>
                {user.email ||
                  "Not specified"}
              </strong>

            </div>

          </div>

        </section>


        {/* ====================================
            LIFESTYLE
        ==================================== */}

        <section className="profile-card">

          <div className="profile-section-header">

            <div>

              <h2>
                Lifestyle Preferences
              </h2>

              <p>
                These preferences help Saathi
                find compatible roommates.
              </p>

            </div>

          </div>


          <div className="profile-lifestyle-grid">

            {/* Food */}

            <div className="profile-preference">

              <span>
                🍱
              </span>

              <div>

                <small>
                  Food
                </small>

                <strong>
                  {user.food ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* Smoking */}

            <div className="profile-preference">

              <span>
                🚬
              </span>

              <div>

                <small>
                  Smoking
                </small>

                <strong>
                  {user.smoking
                    ? "Yes"
                    : "No"}
                </strong>

              </div>

            </div>


            {/* Drinking */}

            <div className="profile-preference">

              <span>
                🍺
              </span>

              <div>

                <small>
                  Drinking
                </small>

                <strong>
                  {user.drinking
                    ? "Yes"
                    : "No"}
                </strong>

              </div>

            </div>


            {/* Sleep */}

            <div className="profile-preference">

              <span>
                🌙
              </span>

              <div>

                <small>
                  Sleep Schedule
                </small>

                <strong>
                  {user.sleepSchedule ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* Cleanliness */}

            <div className="profile-preference">

              <span>
                🧹
              </span>

              <div>

                <small>
                  Cleanliness
                </small>

                <strong>
                  {user.cleanliness ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* Study */}

            <div className="profile-preference">

              <span>
                📚
              </span>

              <div>

                <small>
                  Study Habit
                </small>

                <strong>
                  {user.studyHabit ||
                    "Not specified"}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================
            BIO
        ==================================== */}

        <section className="profile-card">

          <div className="profile-section-header">

            <div>

              <h2>
                About Me
              </h2>

            </div>

          </div>

          <p className="profile-bio">

            {user.bio ||
              "You haven't added a bio yet."}

          </p>

        </section>


        {/* ====================================
            EDIT BUTTON
        ==================================== */}

        <div className="profile-bottom-action">

          <button
            onClick={() =>
              navigate("/profile/edit")
            }
          >
            Edit Profile
          </button>

        </div>

      </main>

    </div>
  );
}

export default Profile;