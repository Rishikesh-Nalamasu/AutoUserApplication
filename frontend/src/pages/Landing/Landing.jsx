import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import './Landing.css';

const FadeInSection = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, ...directions[direction] },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration: 0.7, delay, ease: 'easeOut' },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const Landing = ({ onLoginClick }) => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Based on Real Incidents
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Bridging the Gap Between
            <span className="highlight"> Students </span>
            &amp;
            <span className="highlight"> Auto Drivers</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            No more waiting endlessly. No more missed rides. AutoRide creates a
            seamless real-time connection between college students needing transport
            and auto drivers ready to serve.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <button className="cta-primary" onClick={onLoginClick}>
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a href="#how-it-works" className="cta-secondary">
              See How It Works
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            <div className="stat-item">
              <span className="stat-number">Real-Time</span>
              <span className="stat-label">Live Tracking</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Instant</span>
              <span className="stat-label">Notifications</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Zero</span>
              <span className="stat-label">Communication Gap</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-illustration"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          <div className="illustration-card">
            <div className="illustration-scene">
              <div className="road">
                <div className="road-line"></div>
              </div>
              <div className="auto-icon">
                <div className="auto-body">
                  <div className="auto-top"></div>
                  <div className="auto-window"></div>
                  <div className="auto-bottom"></div>
                  <div className="wheel wheel-front"></div>
                  <div className="wheel wheel-back"></div>
                </div>
              </div>
              <div className="student-icon">
                <div className="student-head"></div>
                <div className="student-body"></div>
                <div className="signal-waves">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="connection-line">
                <svg viewBox="0 0 200 60" className="connection-svg">
                  <path d="M20,30 Q100,5 180,30" stroke="#4caf50" strokeWidth="2" fill="none" strokeDasharray="8,4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
            </div>
            <div className="floating-labels">
              <div className="float-label label-horn">
                <span className="label-dot horn-dot"></span>
                Horn Pressed!
              </div>
              <div className="float-label label-ride">
                <span className="label-dot ride-dot"></span>
                Driver En Route
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem Statement Section */}
      <section className="problem-section">
        <div className="section-container">
          <FadeInSection>
            <div className="section-header">
              <span className="section-tag">The Problem</span>
              <h2>The Daily Struggle We All Know</h2>
              <p className="section-desc">
                Every college student has faced this — you walk out of campus, look around,
                and there's no auto in sight. Or worse, the driver doesn't know students are waiting.
              </p>
            </div>
          </FadeInSection>

          <div className="problem-grid">
            <FadeInSection delay={0.1} direction="left">
              <div className="problem-card">
                <div className="problem-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="#ef5350" strokeWidth="2" />
                    <path d="M24 14v12M24 30v2" stroke="#ef5350" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Students Wait Blindly</h3>
                <p>
                  Students stand at pickup points with no idea if an auto is coming.
                  Precious minutes wasted every single day.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="problem-card">
                <div className="problem-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="12" width="40" height="24" rx="4" stroke="#ef5350" strokeWidth="2" />
                    <path d="M16 20l-4 4 4 4M32 20l4 4-4 4" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" />
                    <path d="M22 28l4-8" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>No Communication</h3>
                <p>
                  Zero way for students and drivers to coordinate. It's pure luck if
                  supply meets demand at the right time and place.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3} direction="right">
              <div className="problem-card">
                <div className="problem-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="20" r="8" stroke="#ef5350" strokeWidth="2" />
                    <path d="M10 40c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#ef5350" strokeWidth="2" />
                    <path d="M30 16l6-6M12 16l-6-6" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Drivers Lose Revenue</h3>
                <p>
                  Drivers circle around empty, burning fuel, while students at another
                  location are desperately looking for a ride.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section" id="how-it-works">
        <div className="section-container">
          <FadeInSection>
            <div className="section-header">
              <span className="section-tag">How It Works</span>
              <h2>Simple. Instant. Effective.</h2>
              <p className="section-desc">
                AutoRide creates a bridge of communication in just a few taps.
              </p>
            </div>
          </FadeInSection>

          <div className="steps-container">
            <FadeInSection delay={0.1}>
              <div className="step-card">
                <div className="step-number">01</div>
                <div className="step-visual">
                  <div className="step-icon-wrap student-step">
                    <svg viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 34c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <h3>Student Signs Up</h3>
                <p>Create an account with your college details — year, branch, section. It takes less than a minute.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="step-card">
                <div className="step-number">02</div>
                <div className="step-visual">
                  <div className="step-icon-wrap horn-step">
                    <svg viewBox="0 0 40 40" fill="none">
                      <path d="M8 20c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" />
                      <circle cx="20" cy="20" r="3" fill="currentColor" />
                      <path d="M20 23v8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <h3>Press the Horn</h3>
                <p>When you need a ride, press the Horn button. Your location is automatically detected and broadcast to all drivers.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div className="step-card">
                <div className="step-number">03</div>
                <div className="step-visual">
                  <div className="step-icon-wrap driver-step">
                    <svg viewBox="0 0 40 40" fill="none">
                      <rect x="6" y="16" width="28" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="13" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="27" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M10 16l3-8h14l3 8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <h3>Driver Sees Demand</h3>
                <p>Drivers see real-time student demand at each location. They know exactly where to go for maximum pickups.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <div className="step-card">
                <div className="step-number">04</div>
                <div className="step-visual">
                  <div className="step-icon-wrap connect-step">
                    <svg viewBox="0 0 40 40" fill="none">
                      <path d="M6 20h28" stroke="currentColor" strokeWidth="2" />
                      <circle cx="10" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
                      <circle cx="30" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M20 12v16" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" />
                    </svg>
                  </div>
                </div>
                <h3>Connected!</h3>
                <p>Students get their ride. Drivers get their fare. Everyone saves time. The communication gap is closed forever.</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <FadeInSection>
            <div className="section-header">
              <span className="section-tag">Features</span>
              <h2>Built for the Real World</h2>
              <p className="section-desc">
                Every feature was designed based on actual pain points faced by students and drivers daily.
              </p>
            </div>
          </FadeInSection>

          <div className="features-grid">
            <FadeInSection delay={0.1}>
              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' }}>
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <circle cx="16" cy="12" r="5" stroke="#2e7d32" strokeWidth="2" />
                    <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#2e7d32" strokeWidth="2" />
                  </svg>
                </div>
                <h4>Geofence Detection</h4>
                <p>Automatically detects which pickup zone you're in using GPS geofencing technology.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.15}>
              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)' }}>
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M16 4v12l8 4" stroke="#e65100" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="12" stroke="#e65100" strokeWidth="2" />
                  </svg>
                </div>
                <h4>Real-Time Updates</h4>
                <p>Live WebSocket connections ensure data is always current. No refreshing needed.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <rect x="4" y="4" width="24" height="24" rx="4" stroke="#1565c0" strokeWidth="2" />
                    <path d="M10 16h12M16 10v12" stroke="#1565c0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h4>Analytics Dashboard</h4>
                <p>Visualize trends — know peak hours, busiest locations, and ride patterns at a glance.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.25}>
              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)' }}>
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M16 4l3 6h7l-5.5 4 2 7L16 17l-6.5 4 2-7L6 10h7l3-6z" stroke="#c62828" strokeWidth="2" />
                  </svg>
                </div>
                <h4>Ride History</h4>
                <p>Both students and drivers can review their complete history of horns and rides.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)' }}>
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M8 8h16v16H8zM4 12h4M24 12h4M4 20h4M24 20h4" stroke="#7b1fa2" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h4>Checkpoint Tracking</h4>
                <p>Driver positions update in real-time along route checkpoints for precise tracking.</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.35}>
              <div className="feature-card">
                <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, #e0f2f1, #b2dfdb)' }}>
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.8 7.8l2.8 2.8M21.4 21.4l2.8 2.8M7.8 24.2l2.8-2.8M21.4 10.6l2.8-2.8" stroke="#00695c" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="5" stroke="#00695c" strokeWidth="2" />
                  </svg>
                </div>
                <h4>Auto-Expiry</h4>
                <p>Horns and rides auto-expire to keep data fresh and prevent stale information.</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <FadeInSection>
            <div className="cta-content">
              <h2>Ready to Never Miss a Ride Again?</h2>
              <p>
                Join AutoRide today and be part of the solution. Whether you're a student
                tired of waiting or a driver looking for passengers — we've got you covered.
              </p>
              <button className="cta-primary cta-large" onClick={onLoginClick}>
                Join AutoRide Now
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>AutoRide</h3>
            <p>Solving real campus transportation problems.</p>
          </div>
          <div className="footer-links">
            <span>Built with purpose</span>
            <span className="footer-dot">·</span>
            <span>Based on true incidents</span>
            <span className="footer-dot">·</span>
            <span>For students, by students</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
