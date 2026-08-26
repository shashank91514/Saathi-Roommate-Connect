import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/editProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user;

      setForm({
        name: user.name || "",
        college: user.college || "",
        course: user.course || "",
        year: user.year || "",
        city: user.city || "",
        budget: user.budget || "",
        food: user.food || "Both",

        smoking:
          user.smoking === true ? "Yes" : "No",

        drinking:
          user.drinking === true ? "Yes" : "No",

        sleepSchedule:
          user.sleepSchedule || "Normal",

        cleanliness:
          user.cleanliness || "Medium",

        studyHabit:
          user.studyHabit || "Moderate",

        bio: user.bio || "",
      });
    } catch (error) {
      console.error("Fetch profile error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: form.name.trim(),
        college: form.college.trim(),
        course: form.course.trim(),
        year: Number(form.year),
        city: form.city.trim(),
        budget: Number(form.budget) || 0,

        // Lifestyle preferences
        food: form.food,

        smoking: form.smoking === "Yes",

        drinking: form.drinking === "Yes",

        sleepSchedule: form.sleepSchedule,

        cleanliness: form.cleanliness,

        studyHabit: form.studyHabit,

        bio: form.bio.trim(),
      };

      console.log("Sending profile data:", updateData);

      const response = await api.put(
        "/users/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Profile update response:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Profile updated successfully!"
      );

      // Go back to profile after successful update
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-loading">
        <div className="edit-spinner"></div>

        <p>Loading profile...</p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="edit-profile-page">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav className="edit-navbar">

        <div
          className="edit-logo"
          onClick={() => navigate("/dashboard")}
        >
          🏠 Saathi
        </div>

        <button
          type="button"
          onClick={() => navigate("/profile")}
        >
          ← Back to Profile
        </button>

      </nav>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="edit-container">

        <div className="edit-header">

          <p>SAATHI</p>

          <h1>Edit Profile</h1>

          <span>
            Update your information and lifestyle
            preferences to find better roommates.
          </span>

        </div>


        <form
          className="edit-form"
          onSubmit={handleSubmit}
        >

          {/* =====================================
              BASIC INFORMATION
          ====================================== */}

          <section className="edit-card">

            <div className="edit-section-title">

              <h2>Basic Information</h2>

              <p>
                Keep your personal and college
                information updated.
              </p>

            </div>


            <div className="edit-grid">

              {/* Name */}

              <div className="edit-field">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

              </div>


              {/* College */}

              <div className="edit-field">

                <label>College</label>

                <input
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="Enter your college"
                  required
                />

              </div>


              {/* Course */}

              <div className="edit-field">

                <label>Course</label>

                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech CSE"
                  required
                />

              </div>


              {/* Year */}

              <div className="edit-field">

                <label>Year</label>

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select year
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


              {/* City */}

              <div className="edit-field">

                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

              </div>


              {/* Budget */}

              <div className="edit-field">

                <label>
                  Monthly Budget
                </label>

                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="₹ Monthly budget"
                  min="0"
                />

              </div>

            </div>

          </section>


          {/* =====================================
              LIFESTYLE PREFERENCES
          ====================================== */}

          <section className="edit-card">

            <div className="edit-section-title">

              <h2>
                Lifestyle Preferences
              </h2>

              <p>
                These preferences are used by Saathi
                to calculate roommate compatibility.
              </p>

            </div>


            <div className="edit-grid">

              {/* Food */}

              <div className="edit-field">

                <label>
                  🍱 Food Preference
                </label>

                <select
                  name="food"
                  value={form.food}
                  onChange={handleChange}
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

              <div className="edit-field">

                <label>
                  🚬 Smoking
                </label>

                <select
                  name="smoking"
                  value={form.smoking}
                  onChange={handleChange}
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

              <div className="edit-field">

                <label>
                  🍺 Drinking
                </label>

                <select
                  name="drinking"
                  value={form.drinking}
                  onChange={handleChange}
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

              <div className="edit-field">

                <label>
                  🌙 Sleep Schedule
                </label>

                <select
                  name="sleepSchedule"
                  value={form.sleepSchedule}
                  onChange={handleChange}
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

              <div className="edit-field">

                <label>
                  🧹 Cleanliness
                </label>

                <select
                  name="cleanliness"
                  value={form.cleanliness}
                  onChange={handleChange}
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

              <div className="edit-field">

                <label>
                  📚 Study Habit
                </label>

                <select
                  name="studyHabit"
                  value={form.studyHabit}
                  onChange={handleChange}
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

            </div>

          </section>


          {/* =====================================
              ABOUT
          ====================================== */}

          <section className="edit-card">

            <div className="edit-section-title">

              <h2>About You</h2>

              <p>
                Add a short introduction for
                potential roommates.
              </p>

            </div>


            <div className="edit-field">

              <label>Bio</label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell potential roommates a little about yourself..."
                rows="5"
                maxLength="500"
              />

              <small>
                {form.bio.length}/500
              </small>

            </div>

          </section>


          {/* =====================================
              SUCCESS / ERROR
          ====================================== */}

          {message && (
            <div className="edit-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="edit-error">
              ⚠️ {error}
            </div>
          )}


          {/* =====================================
              ACTION BUTTONS
          ====================================== */}

          <div className="edit-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditProfile;