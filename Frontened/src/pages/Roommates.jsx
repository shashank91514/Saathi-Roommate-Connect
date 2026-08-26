import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/roommates.css";

function Roommates() {
  const navigate = useNavigate();

  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    college: "",
    city: "",
    budget: "",
  });

  // ======================================
  // FETCH ROOMMATES
  // ======================================

  useEffect(() => {
    fetchRoommates();
  }, []);

  const fetchRoommates = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const params = {};

      if (customFilters.college.trim()) {
        params.college =
          customFilters.college.trim();
      }

      if (customFilters.city.trim()) {
        params.city =
          customFilters.city.trim();
      }

      if (customFilters.budget) {
        params.budget =
          customFilters.budget;
      }

      const response = await api.get(
        "/roommates",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoommates(
        response.data.roommates || []
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load roommates"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // HANDLE FILTER CHANGE
  // ======================================

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================
  // SEARCH
  // ======================================

  const handleSearch = (e) => {
    e.preventDefault();

    fetchRoommates(filters);
  };

  // ======================================
  // CLEAR FILTERS
  // ======================================

  const clearFilters = () => {
    const emptyFilters = {
      college: "",
      city: "",
      budget: "",
    };

    setFilters(emptyFilters);

    fetchRoommates(emptyFilters);
  };

  // ======================================
  // COMPATIBILITY COLOR
  // ======================================

  const getCompatibilityClass = (score) => {
    if (score >= 80) {
      return "excellent";
    }

    if (score >= 60) {
      return "good";
    }

    return "average";
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="roommates-page">
        <div className="roommates-loading">
          <div className="roommates-spinner"></div>

          <h2>
            Finding your best roommates...
          </h2>
        </div>
      </div>
    );
  }

  // ======================================
  // PAGE
  // ======================================

  return (
    <div className="roommates-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="roommates-header">

        <button
          className="back-dashboard"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <h1>
          Find Your Roommate
        </h1>

        <p>
          Discover students who match your
          lifestyle and preferences.
        </p>

      </div>


      {/* ==================================
          FILTERS
      ================================== */}

      <form
        className="roommate-filters"
        onSubmit={handleSearch}
      >

        <div className="filter-group">
          <label>College</label>

          <input
            type="text"
            name="college"
            placeholder="Enter college"
            value={filters.college}
            onChange={handleChange}
          />
        </div>


        <div className="filter-group">
          <label>City</label>

          <input
            type="text"
            name="city"
            placeholder="Enter city"
            value={filters.city}
            onChange={handleChange}
          />
        </div>


        <div className="filter-group">
          <label>Maximum Budget</label>

          <input
            type="number"
            name="budget"
            placeholder="₹8000"
            value={filters.budget}
            onChange={handleChange}
          />
        </div>


        <div className="filter-buttons">

          <button
            type="submit"
            className="search-button"
          >
            Search
          </button>

          <button
            type="button"
            className="clear-button"
            onClick={clearFilters}
          >
            Clear
          </button>

        </div>

      </form>


      {/* ==================================
          ERROR
      ================================== */}

      {error && (
        <div className="roommates-error">

          <p>{error}</p>

          <button
            onClick={() =>
              fetchRoommates()
            }
          >
            Try Again
          </button>

        </div>
      )}


      {/* ==================================
          RESULTS HEADER
      ================================== */}

      {!error && (
        <div className="results-header">

          <div>
            <h2>
              Recommended Roommates
            </h2>

            <p>
              Ranked according to your
              compatibility.
            </p>
          </div>

          <span>
            {roommates.length}{" "}
            {roommates.length === 1
              ? "match"
              : "matches"}
          </span>

        </div>
      )}


      {/* ==================================
          NO RESULTS
      ================================== */}

      {!error &&
        roommates.length === 0 && (
          <div className="no-roommates">

            <div className="no-roommates-icon">
              🔍
            </div>

            <h2>
              No roommates found
            </h2>

            <p>
              Try changing your filters to
              find more students.
            </p>

            <button
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        )}


      {/* ==================================
          ROOMMATE CARDS
      ================================== */}

      {!error &&
        roommates.length > 0 && (
          <div className="roommates-grid">

            {roommates.map(
              (roommate, index) => {

                const score =
                  roommate.compatibility || 0;

                return (
                  <div
                    className={`roommate-card ${
                      index === 0
                        ? "best-match-card"
                        : ""
                    }`}
                    key={roommate._id}
                  >

                    {/* BEST MATCH */}

                    {index === 0 && (
                      <div className="best-match">
                        ⭐ Best Match
                      </div>
                    )}


                    {/* PROFILE */}

                    <div className="roommate-profile">

                      <div className="roommate-avatar">

                        {roommate.profileImage ? (
                          <img
                            src={
                              roommate.profileImage
                            }
                            alt={
                              roommate.name
                            }
                          />
                        ) : (
                          roommate.name
                            ?.charAt(0)
                            ?.toUpperCase()
                        )}

                      </div>


                      <div className="roommate-info">

                        <h3>
                          {roommate.name}
                        </h3>

                        <p>
                          {roommate.course}
                        </p>

                      </div>

                    </div>


                    {/* COMPATIBILITY */}

                    <div className="compatibility-row">

                      <span>
                        🎯 Compatibility
                      </span>

                      <strong
                        className={getCompatibilityClass(
                          score
                        )}
                      >
                        {score}%
                      </strong>

                    </div>


                    {/* DETAILS */}

                    <div className="roommate-details">

                      <p>
                        🎓{" "}
                        {roommate.college}
                      </p>

                      <p>
                        📚 Year{" "}
                        {roommate.year}
                      </p>

                      {roommate.city && (
                        <p>
                          📍{" "}
                          {roommate.city}
                        </p>
                      )}

                      {roommate.budget > 0 && (
                        <p>
                          💰 ₹
                          {roommate.budget}
                          /month
                        </p>
                      )}

                    </div>


                    {/* LIFESTYLE */}

                    <div className="lifestyle-tags">

                      <span>
                        🍱{" "}
                        {roommate.food}
                      </span>

                      <span>
                        🌙{" "}
                        {roommate.sleepSchedule}
                      </span>

                      <span>
                        🧹{" "}
                        {roommate.cleanliness}
                      </span>

                    </div>


                    {/* BUTTONS */}

                    <div className="roommate-actions">

                      <button
                        className="view-profile-button"
                        onClick={() =>
                          navigate(
                            `/roommates/${roommate._id}`
                          )
                        }
                      >
                        View Profile
                      </button>

                      <button
                        className="connect-button"
                        onClick={() =>
                          navigate(
                            `/roommates/${roommate._id}`
                          )
                        }
                      >
                        Connect
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

    </div>
  );
}

export default Roommates;