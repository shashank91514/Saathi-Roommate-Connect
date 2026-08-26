import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "",
    year: "",
    city: "",
    budget: "",
    food: "Both",
    smoking: "No",
    drinking: "No",
    sleepSchedule: "Normal",
    cleanliness: "Medium",
    studyHabit: "Moderate",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // ========================================
  // REGISTER
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        course: formData.course.trim(),
        year: Number(formData.year),

        city: formData.city.trim(),
        budget: Number(formData.budget) || 0,

        // Lifestyle
        food: formData.food,
        smoking: formData.smoking === "Yes",
        drinking: formData.drinking === "Yes",
        sleepSchedule: formData.sleepSchedule,
        cleanliness: formData.cleanliness,
        studyHabit: formData.studyHabit,
      });

      setMessage(
        response.data.message ||
          "Registration successful!"
      );

      // Go to login
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="register-page">

      <div className="register-container">

        {/* Header */}

        <div className="register-header">

          <h1>Create Your Saathi Account</h1>

          <p>
            Join students looking for the right
            roommate.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          {/* ==================================
              BASIC INFORMATION
          ================================== */}

          <h2>Basic Information</h2>

          {/* Name */}

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />

          </div>


          {/* College */}

          <div className="form-group">

            <label>College</label>

            <input
              type="text"
              name="college"
              placeholder="Enter your college"
              value={formData.college}
              onChange={handleChange}
              required
            />

          </div>


          {/* Course */}

          <div className="form-group">

            <label>Course</label>

            <input
              type="text"
              name="course"
              placeholder="e.g. B.Tech CSE"
              value={formData.course}
              onChange={handleChange}
              required
            />

          </div>


          {/* Year */}

          <div className="form-group">

            <label>Year</label>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Year
              </option>

              <option value="1">
                1st Year
              </option>

              <option value="2">
                2nd Year
              </option>

              <option value="3">
                3rd Year
              </option>

              <option value="4">
                4th Year
              </option>

            </select>

          </div>


          {/* ==================================
              LOCATION & BUDGET
          ================================== */}

          <h2>Roommate Requirements</h2>


          {/* City */}

          <div className="form-group">

            <label>City</label>

            <input
              type="text"
              name="city"
              placeholder="e.g. Delhi"
              value={formData.city}
              onChange={handleChange}
              required
            />

          </div>


          {/* Budget */}

          <div className="form-group">

            <label>
              Monthly Room Budget
            </label>

            <input
              type="number"
              name="budget"
              placeholder="e.g. 8000"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              required
            />

          </div>


          {/* ==================================
              LIFESTYLE PREFERENCES
          ================================== */}

          <h2>Lifestyle Preferences</h2>

          <p className="section-description">
            This information helps Saathi find
            compatible roommates for you.
          </p>


          {/* Food */}

          <div className="form-group">

            <label>
              🍱 Food Preference
            </label>

            <select
              name="food"
              value={formData.food}
              onChange={handleChange}
              required
            >

              <option value="Vegetarian">
                Vegetarian
              </option>

              <option value="Non-Vegetarian">
                Non-Vegetarian
              </option>

              <option value="Both">
                Both
              </option>

            </select>

          </div>


          {/* Smoking */}

          <div className="form-group">

            <label>
              🚬 Smoking
            </label>

            <select
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
              required
            >

              <option value="No">
                No
              </option>

              <option value="Yes">
                Yes
              </option>

            </select>

          </div>


          {/* Drinking */}

          <div className="form-group">

            <label>
              🍺 Drinking
            </label>

            <select
              name="drinking"
              value={formData.drinking}
              onChange={handleChange}
              required
            >

              <option value="No">
                No
              </option>

              <option value="Yes">
                Yes
              </option>

            </select>

          </div>


          {/* Sleep Schedule */}

          <div className="form-group">

            <label>
              🌙 Sleep Schedule
            </label>

            <select
              name="sleepSchedule"
              value={formData.sleepSchedule}
              onChange={handleChange}
              required
            >

              <option value="Early">
                Early
              </option>

              <option value="Normal">
                Normal
              </option>

              <option value="Late">
                Late
              </option>

            </select>

          </div>


          {/* Cleanliness */}

          <div className="form-group">

            <label>
              🧹 Cleanliness
            </label>

            <select
              name="cleanliness"
              value={formData.cleanliness}
              onChange={handleChange}
              required
            >

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

          </div>


          {/* Study Habit */}

          <div className="form-group">

            <label>
              📚 Study Habit
            </label>

            <select
              name="studyHabit"
              value={formData.studyHabit}
              onChange={handleChange}
              required
            >

              <option value="Quiet">
                Quiet
              </option>

              <option value="Moderate">
                Moderate
              </option>

              <option value="Group">
                Group
              </option>

            </select>

          </div>


          {/* ==================================
              MESSAGE
          ================================== */}

          {message && (
            <div className="success-message">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}


          {/* ==================================
              SUBMIT
          ================================== */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* Login */}

        <p className="login-link">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;