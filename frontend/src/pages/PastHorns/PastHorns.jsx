import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PastHorns.css';

const PastHorns = () => {
  const [horns, setHorns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPastHorns();
  }, []);

  const fetchPastHorns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/student/past-horns', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setHorns(data.horns || []);
      }
    } catch (error) {
      console.error('Failed to fetch past horns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHorns = horns.filter((horn) => {
    if (filter === 'all') return true;
    return horn.status === filter.toUpperCase();
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

  return (
    <div className="past-horns-page">
      <div className="past-horns-container">
        <motion.div
          className="past-horns-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>
              <svg viewBox="0 0 24 24" fill="none" stroke="#ff9800" strokeWidth="2" width="28" height="28">
                <path d="M6 15a6 6 0 0112 0" />
                <path d="M3 15a9 9 0 0118 0" />
                <circle cx="12" cy="15" r="2" fill="#ff9800" />
                <path d="M12 17v4" strokeLinecap="round" />
              </svg>
              My Past Horns
            </h1>
            <p className="horns-subtitle">Your ride request history at a glance</p>
          </div>
          <div className="header-stats">
            <div className="mini-stat horn-stat">
              <span className="mini-stat-num">{horns.length}</span>
              <span className="mini-stat-label">Total Horns</span>
            </div>
            <div className="mini-stat horn-stat">
              <span className="mini-stat-num horn-active-num">{horns.filter(h => h.status === 'ON').length}</span>
              <span className="mini-stat-label">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="horn-filter-tabs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {['all', 'on', 'off'].map((f) => (
            <button
              key={f}
              className={`horn-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Horns' : f === 'on' ? 'Active' : 'Expired'}
              <span className="horn-tab-count">
                {f === 'all' ? horns.length : horns.filter(h => h.status === f.toUpperCase()).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Horns List */}
        <div className="horns-list">
          {loading ? (
            <div className="horns-loading">
              <div className="horns-spinner"></div>
              <p>Loading your horns...</p>
            </div>
          ) : filteredHorns.length === 0 ? (
            <motion.div
              className="horns-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="2" />
                <path d="M28 48c0 0 4 6 12 6s12-6 12-6" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="32" r="3" fill="#e0e0e0" />
                <circle cx="50" cy="32" r="3" fill="#e0e0e0" />
              </svg>
              <h3>No horns found</h3>
              <p>Press the Horn button on the home page to request a ride!</p>
            </motion.div>
          ) : (
            filteredHorns.map((horn, index) => (
              <motion.div
                key={horn.horn_id}
                className={`horn-card ${horn.status === 'ON' ? 'horn-active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="horn-icon-col">
                  <div className={`horn-status-icon ${horn.status === 'ON' ? 'on' : 'off'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M6 15a6 6 0 0112 0" />
                      <path d="M3 15a9 9 0 0118 0" />
                      <circle cx="12" cy="15" r="2" fill="currentColor" />
                      <path d="M12 17v4" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="horn-details">
                  <div className="horn-main">
                    <h4>{horn.location_name || 'Unknown Location'}</h4>
                    <span className={`horn-status-badge ${horn.status === 'ON' ? 'horn-badge-on' : 'horn-badge-off'}`}>
                      {horn.status === 'ON' ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="horn-meta">
                    <span className="horn-meta-item">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                        <rect x="2" y="2" width="12" height="12" rx="2" />
                        <path d="M2 6h12" />
                      </svg>
                      {formatDate(horn.created_at)}
                    </span>
                    <span className="horn-meta-item">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                        <circle cx="8" cy="8" r="6" />
                        <path d="M8 4v4l3 1.5" />
                      </svg>
                      {formatTime(horn.created_at)}
                    </span>
                  </div>
                </div>
                <div className="horn-id">#{horn.horn_id}</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PastHorns;
