import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while user types
    if (error) {
      setError("");
    }
  };


  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ========================================
      // LOGIN API
      // POST /api/auth/login
      // ========================================

      const response = await api.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      // ========================================
      // SAVE JWT TOKEN
      // ========================================

      localStorage.setItem(
        "token",
        response.data.token
      );


      // ========================================
      // SAVE USER DATA
      // ========================================

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }


      // ========================================
      // GO TO DASHBOARD
      // ========================================

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="login-page">

      {/* ========================================
          LEFT SIDE
      ======================================== */}

      <div className="login-left">

        {/* BRAND */}

        <Link
          to="/"
          className="login-brand"
        >
          <span className="login-logo-icon">
            S
          </span>

          <span>
            Saathi
          </span>
        </Link>


        {/* LEFT CONTENT */}

        <div className="login-left-content">

          <div className="login-badge">
            🏠 Better roommate. Better living.
          </div>


          <h1>
            Find a roommate
            <span>
              you'll love living with.
            </span>
          </h1>


          <p>
            Connect with students who match
            your lifestyle, budget and everyday
            habits.
          </p>


          {/* BENEFITS */}

          <div className="login-benefits">

            <div>
              <span>✓</span>

              Lifestyle-based roommate discovery
            </div>


            <div>
              <span>✓</span>

              Connect with fellow college students
            </div>


            <div>
              <span>✓</span>

              Simple and secure connections
            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="login-left-footer">
          © 2026 Saathi
        </div>

      </div>


      {/* ========================================
          RIGHT SIDE
      ======================================== */}

      <div className="login-right">

        <div className="login-card">


          {/* MOBILE BRAND */}

          <div className="mobile-login-brand">

            <span className="login-logo-icon">
              S
            </span>

            <span>
              Saathi
            </span>

          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h2>
              Welcome back 👋
            </h2>

            <p>
              Login to continue finding your Saathi.
            </p>

          </div>


          {/* =====================================
              ERROR MESSAGE
          ===================================== */}

          {error && (
            <div className="login-error">

              <span>
                ⚠
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* =====================================
              LOGIN FORM
          ===================================== */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="email">
                Email address
              </label>


              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>


                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <span>
                  Keep your account secure
                </span>

              </div>


              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>


                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />


                {/* SHOW / HIDE PASSWORD */}

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* ==================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <span>
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* =====================================
              REGISTER
          ===================================== */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          {/* =====================================
              BACK TO LANDING
          ===================================== */}

          <div className="login-back">

            <Link to="/">
              ← Back to Saathi
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;