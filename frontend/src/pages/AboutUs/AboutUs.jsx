import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import './AboutUs.css';

const AnimatedSection = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start('visible');
  }, [isInView, controls]);

  const dirs = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, ...dirs[direction] },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  );
};

const AboutUs = () => {
  const timelineEvents = [
    {
      icon: '😤',
      title: 'The Frustration',
      description:
        'Students waiting outside college gates for 30+ minutes, with no auto in sight. Drivers circling empty on other roads. A daily frustration experienced by thousands.',
    },
    {
      icon: '💡',
      title: 'The Idea',
      description:
        'What if students could broadcast that they need a ride — and drivers could see exactly where the demand is? A simple idea born from real frustration.',
    },
    {
      icon: '🔨',
      title: 'The Build',
      description:
        'We built AutoRide with real-time WebSockets, GPS geofencing, and live dashboards. Every feature was tested with actual students and drivers on campus.',
    },
    {
      icon: '🚀',
      title: 'The Impact',
      description:
        'No more blind waiting. No more missed fares. Students get rides faster, drivers earn more efficiently. The communication gap is finally closed.',
    },
  ];

  const teamValues = [
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
          <circle cx="20" cy="15" r="7" stroke="#2e7d32" strokeWidth="2" />
          <path d="M8 35c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#2e7d32" strokeWidth="2" />
        </svg>
      ),
      title: 'Student-First Design',
      description: 'Built around the actual needs and routines of college students commuting daily.',
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
          <path d="M20 4l4 8h9l-7 5 3 9-9-6-9 6 3-9-7-5h9l4-8z" stroke="#ff9800" strokeWidth="2" />
        </svg>
      ),
      title: 'Real Problem, Real Solution',
      description: 'Not a hypothetical project — this addresses a genuine transportation gap faced every day.',
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
          <rect x="6" y="6" width="28" height="28" rx="4" stroke="#1565c0" strokeWidth="2" />
          <path d="M14 20l4 4 8-8" stroke="#1565c0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Technology That Works',
      description: 'Real-time WebSockets, GPS geofencing, live dashboards — production-grade tech for a real use case.',
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
          <circle cx="14" cy="16" r="5" stroke="#7b1fa2" strokeWidth="2" />
          <circle cx="26" cy="16" r="5" stroke="#7b1fa2" strokeWidth="2" />
          <path d="M4 32c0-5.5 4.5-10 10-10M26 22c5.5 0 10 4.5 10 10" stroke="#7b1fa2" strokeWidth="2" />
        </svg>
      ),
      title: 'Community Impact',
      description: 'Helping students save time and money while ensuring drivers maximize their earnings.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Banner */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-shape about-shape-1"></div>
          <div className="about-shape about-shape-2"></div>
        </div>
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="about-tag"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Born from Real Incidents.<br />Built to Solve Real Problems.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            AutoRide isn't just a project — it's a response to the daily struggle of college
            students and auto drivers who couldn't communicate when they needed each other the most.
          </motion.p>
        </motion.div>
      </section>

      {/* Origin Story Section */}
      <section className="origin-section">
        <div className="origin-container">
          <AnimatedSection>
            <div className="origin-header">
              <span className="about-section-tag">The Origin</span>
              <h2>A Problem We Lived Through</h2>
            </div>
          </AnimatedSection>

          <div className="origin-story">
            <AnimatedSection delay={0.1} direction="left">
              <div className="story-card story-student">
                <div className="story-icon-wrap">
                  <span>🎓</span>
                </div>
                <h3>The Student's Side</h3>
                <p>
                  Every evening after classes, students would gather at the college gate, 
                  hoping an auto would come. Sometimes they'd wait 20, 30, even 45 minutes. 
                  Calling autos? No numbers. Apps? Not available in the area. 
                  The only option was to wait and hope.
                </p>
                <div className="story-quote">
                  "We just stood there, staring at an empty road, wondering if anyone would come."
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="right">
              <div className="story-card story-driver">
                <div className="story-icon-wrap">
                  <span>🚗</span>
                </div>
                <h3>The Driver's Side</h3>
                <p>
                  Meanwhile, auto drivers were driving on different routes, completely unaware 
                  that a group of students was desperately waiting just a few minutes away. 
                  They'd burn fuel, lose time, and miss fares — all because there was no way 
                  to know where the demand was.
                </p>
                <div className="story-quote">
                  "If only someone had told me students were waiting, I would've gone straight there."
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3}>
            <div className="bridge-message">
              <div className="bridge-line"></div>
              <div className="bridge-text">
                <strong>The gap was clear:</strong> Students and drivers needed each other, 
                but had no way to communicate. AutoRide was built to be that bridge.
              </div>
              <div className="bridge-line"></div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-container">
          <AnimatedSection>
            <div className="origin-header">
              <span className="about-section-tag">Our Journey</span>
              <h2>From Frustration to Solution</h2>
            </div>
          </AnimatedSection>

          <div className="timeline">
            {timelineEvents.map((event, index) => (
              <AnimatedSection key={index} delay={0.15 * index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <div className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}>
                  <div className="timeline-dot">
                    <span>{event.icon}</span>
                  </div>
                  <div className="timeline-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
            <div className="timeline-line"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <AnimatedSection>
            <div className="origin-header">
              <span className="about-section-tag">What We Stand For</span>
              <h2>Built With Purpose</h2>
              <p className="values-desc">
                Every line of code in AutoRide serves a purpose — reducing the communication 
                gap between students and auto drivers.
              </p>
            </div>
          </AnimatedSection>

          <div className="values-grid">
            {teamValues.map((value, index) => (
              <AnimatedSection key={index} delay={0.1 * index}>
                <div className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <div className="tech-container">
          <AnimatedSection>
            <div className="origin-header">
              <span className="about-section-tag">Tech Stack</span>
              <h2>Powered By Modern Tech</h2>
            </div>
          </AnimatedSection>

          <div className="tech-grid">
            <AnimatedSection delay={0.1}>
              <div className="tech-card">
                <div className="tech-badge react-badge">Frontend</div>
                <h4>React + Vite</h4>
                <p>Fast, responsive UI with real-time state management</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="tech-card">
                <div className="tech-badge node-badge">Backend</div>
                <h4>Node.js + Express</h4>
                <p>Robust API server handling auth, data, and business logic</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="tech-card">
                <div className="tech-badge socket-badge">Real-Time</div>
                <h4>Socket.io</h4>
                <p>WebSocket connections for instant data updates</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.25}>
              <div className="tech-card">
                <div className="tech-badge db-badge">Database</div>
                <h4>MySQL</h4>
                <p>Spatial queries and geofencing with reliable data storage</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
