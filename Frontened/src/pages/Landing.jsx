import { Link } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="landing-page">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="landing-navbar">

        <Link to="/" className="landing-logo">
          <span className="logo-icon">S</span>
          <span>Saathi</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Login</Link>

          <Link
            to="/register"
            className="nav-signup"
          >
            Get Started
          </Link>
        </div>

      </nav>


      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            🏠 Find your ideal college roommate
          </div>

          <h1>
            Find Your Perfect
            <span> Roommate.</span>
          </h1>

          <p className="hero-description">
            Connect with college students who match
            your lifestyle, budget, habits and
            preferences. Because great living starts
            with the right Saathi.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-button"
            >
              Find My Roommate
              <span>→</span>
            </Link>

            <Link
              to="/login"
              className="secondary-button"
            >
              Login
            </Link>

          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              <span>👨🏻</span>
              <span>👩🏻</span>
              <span>👨🏽</span>
              <span>👩🏽</span>
            </div>

            <div>
              <strong>Built for students</strong>
              <small>
                Find someone you'll enjoy living with
              </small>
            </div>
          </div>

        </div>


        {/* ==========================================
            HERO VISUAL
        ========================================== */}

        <div className="hero-visual">

          <div className="visual-glow"></div>

          <div className="room-card">

            <div className="room-card-header">
              <span>✨ Your Match</span>
              <span className="match-percent">
                94%
              </span>
            </div>

            <div className="profile-preview">

              <div className="profile-avatar">
                👨🏻‍💻
              </div>

              <div>
                <h3>Arjun Sharma</h3>
                <p>Computer Science • 3rd Year</p>
              </div>

            </div>

            <div className="match-tags">

              <span>🍱 Food</span>
              <span>📚 Study</span>
              <span>🌙 Sleep</span>
              <span>🧹 Clean</span>

            </div>

            <div className="compatibility-bar">

              <div className="bar-label">
                <span>Compatibility</span>
                <strong>94%</strong>
              </div>

              <div className="bar">
                <div></div>
              </div>

            </div>

            <button className="connect-preview">
              View Profile →
            </button>

          </div>


          <div className="floating-card floating-budget">
            <span>💰</span>
            <div>
              <strong>₹8,000</strong>
              <small>Monthly budget</small>
            </div>
          </div>


          <div className="floating-card floating-match">
            <span>💜</span>
            <div>
              <strong>Great Match!</strong>
              <small>Similar lifestyle</small>
            </div>
          </div>

        </div>

      </section>


      {/* ==========================================
          FEATURES
      ========================================== */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span className="section-label">
            WHY SAATHI?
          </span>

          <h2>
            More than just finding
            <span> a roommate.</span>
          </h2>

          <p>
            Find someone who fits your lifestyle,
            not just your room.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🎯
            </div>

            <h3>Smart Compatibility</h3>

            <p>
              Find roommates based on lifestyle,
              habits, budget and personal preferences.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🎓
            </div>

            <h3>College Focused</h3>

            <p>
              Connect with students who understand
              your college life and academic routine.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              💰
            </div>

            <h3>Budget Friendly</h3>

            <p>
              Find people with similar budgets so
              splitting rent becomes easier.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🤝
            </div>

            <h3>Connect Safely</h3>

            <p>
              Send connection requests and get
              notified when someone responds.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          HOW IT WORKS
      ========================================== */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Find your Saathi in
            <span> 3 simple steps.</span>
          </h2>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              👤
            </div>

            <h3>Create Your Profile</h3>

            <p>
              Tell us about yourself, your college,
              budget and lifestyle.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🔎
            </div>

            <h3>Discover Roommates</h3>

            <p>
              Browse students and find people
              who match your preferences.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🤝
            </div>

            <h3>Connect</h3>

            <p>
              Send a connection request and start
              getting to know your potential Saathi.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          LIFESTYLE SECTION
      ========================================== */}

      <section className="lifestyle-section">

        <div className="lifestyle-content">

          <span className="section-label">
            FIND YOUR MATCH
          </span>

          <h2>
            Your lifestyle matters.
          </h2>

          <p>
            From sleep schedules to food preferences,
            Saathi helps you find people who fit
            naturally into your everyday life.
          </p>

          <div className="lifestyle-list">

            <div>
              <span>🌙</span>
              Sleep schedules
            </div>

            <div>
              <span>🍱</span>
              Food preferences
            </div>

            <div>
              <span>🧹</span>
              Cleanliness habits
            </div>

            <div>
              <span>📚</span>
              Study habits
            </div>

          </div>

        </div>


        <div className="lifestyle-visual">

          <div className="circle-decoration"></div>

          <div className="lifestyle-card">

            <div className="mini-profile">
              <span>👩🏻‍💻</span>

              <div>
                <strong>Priya</strong>
                <small>92% Compatible</small>
              </div>
            </div>

            <div className="preference-row">
              <span>🌙 Sleep</span>
              <strong>Similar</strong>
            </div>

            <div className="preference-row">
              <span>🍱 Food</span>
              <strong>Same</strong>
            </div>

            <div className="preference-row">
              <span>🧹 Cleanliness</span>
              <strong>Similar</strong>
            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          FINAL CTA
      ========================================== */}

      <section className="cta-section">

        <div className="cta-content">

          <div className="cta-icon">
            🏠
          </div>

          <h2>
            Ready to find your Saathi?
          </h2>

          <p>
            Create your profile and start discovering
            better roommate matches today.
          </p>

          <Link
            to="/register"
            className="cta-button"
          >
            Get Started
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="landing-footer">

        <div className="footer-brand">

          <Link
            to="/"
            className="landing-logo"
          >
            <span className="logo-icon">
              S
            </span>

            <span>Saathi</span>
          </Link>

          <p>
            Better roommate. Better living.
          </p>

        </div>

        <div className="footer-links">

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Get Started
          </Link>

        </div>

        <div className="footer-copy">
          © 2026 Saathi. Built for students.
        </div>

      </footer>

    </div>
  );
}

export default Landing;