import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PastRides.css';

const PastRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, on, off

  useEffect(() => {
    fetchPastRides();
  }, []);

  const fetchPastRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/driver/past-rides', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setRides(data.rides || []);
      }
    } catch (error) {
      console.error('Failed to fetch past rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRides = rides.filter((ride) => {
    if (filter === 'all') return true;
    return ride.status === filter.toUpperCase();
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (start) => {
    const startDate = new Date(start);
    const now = new Date();
    const diff = Math.floor((now - startDate) / 60000);
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  return (
    <div className="past-rides-page">
      <div className="past-rides-container">
        <motion.div
          className="past-rides-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>
              <svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" width="28" height="28">
                <rect x="3" y="11" width="18" height="8" rx="2" />
                <circle cx="7.5" cy="19" r="1.5" />
                <circle cx="16.5" cy="19" r="1.5" />
                <path d="M5 11l2-5h10l2 5" />
              </svg>
              My Past Rides
            </h1>
            <p className="rides-subtitle">Track all your ride history and performance</p>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <span className="mini-stat-num">{rides.length}</span>
              <span className="mini-stat-label">Total Rides</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-num active-num">{rides.filter(r => r.status === 'ON').length}</span>
              <span className="mini-stat-label">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="filter-tabs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {['all', 'on', 'off'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Rides' : f === 'on' ? 'Active' : 'Completed'}
              <span className="tab-count">
                {f === 'all' ? rides.length : rides.filter(r => r.status === f.toUpperCase()).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Rides List */}
        <div className="rides-list">
          {loading ? (
            <div className="rides-loading">
              <div className="rides-spinner"></div>
              <p>Loading your rides...</p>
            </div>
          ) : filteredRides.length === 0 ? (
            <motion.div
              className="rides-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="2" />
                <path d="M25 45c0 0 5 8 15 8s15-8 15-8" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="32" r="3" fill="#e0e0e0" />
                <circle cx="50" cy="32" r="3" fill="#e0e0e0" />
              </svg>
              <h3>No rides found</h3>
              <p>Your ride history will appear here</p>
            </motion.div>
          ) : (
            filteredRides.map((ride, index) => (
              <motion.div
                key={ride.ride_id}
                className={`ride-card ${ride.status === 'ON' ? 'ride-active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="ride-icon-col">
                  <div className={`ride-status-icon ${ride.status === 'ON' ? 'on' : 'off'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <rect x="3" y="11" width="18" height="8" rx="2" />
                      <circle cx="7.5" cy="19" r="1.5" />
                      <circle cx="16.5" cy="19" r="1.5" />
                      <path d="M5 11l2-5h10l2 5" />
                    </svg>
                  </div>
                </div>
                <div className="ride-details">
                  <div className="ride-main">
                    <h4>{ride.checkpoint_name || 'Unknown Checkpoint'}</h4>
                    <span className={`ride-status-badge ${ride.status === 'ON' ? 'badge-on' : 'badge-off'}`}>
                      {ride.status === 'ON' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <div className="ride-meta">
                    <span className="ride-meta-item">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                        <rect x="2" y="2" width="12" height="12" rx="2" />
                        <path d="M2 6h12" />
                      </svg>
                      {formatDate(ride.start_time)}
                    </span>
                    <span className="ride-meta-item">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                        <circle cx="8" cy="8" r="6" />
                        <path d="M8 4v4l3 1.5" />
                      </svg>
                      {formatTime(ride.start_time)}
                    </span>
                    {ride.status === 'ON' && (
                      <span className="ride-meta-item duration">
                        {getDuration(ride.start_time)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ride-id">#{ride.ride_id}</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PastRides;
