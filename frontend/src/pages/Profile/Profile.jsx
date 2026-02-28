import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, userType, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      if (userType === 'student') {
        setFormData({
          name: user.name || '',
          year: user.year || '',
          branch: user.branch || '',
          section: user.section || '',
          email: user.email || '',
        });
      } else {
        setFormData({
          name: user.name || '',
          auto_reg_no: user.auto_reg_no || '',
          email: user.email || '',
        });
      }
    }
  }, [user, userType]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        updateUser(data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      if (userType === 'student') {
        setFormData({ name: user.name, year: user.year, branch: user.branch, section: user.section, email: user.email });
      } else {
        setFormData({ name: user.name, auto_reg_no: user.auto_reg_no, email: user.email });
      }
    }
  };

  const yearOptions = ['1st', '2nd', '3rd', '4th'];
  const branchOptions = ['Computer Science', 'Data Science', 'AI/ML', 'Civil', 'Mechanical'];
  const sectionOptions = ['A', 'B', 'C', 'D'];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header card */}
        <motion.div
          className="profile-header-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-header-bg">
            <div className="profile-bg-shape profile-bg-1"></div>
            <div className="profile-bg-shape profile-bg-2"></div>
          </div>
          <div className="profile-header-content">
            <div className={`profile-avatar ${userType}`}>
              <span>{getInitials(user.name)}</span>
            </div>
            <div className="profile-header-info">
              <h1>{user.name}</h1>
              <span className={`profile-role-badge ${userType}`}>
                {userType === 'student' ? '🎓 Student' : '🚗 Driver'}
              </span>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            className={`profile-message ${message.type}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.text}
          </motion.div>
        )}

        {/* Info Cards */}
        <div className="profile-cards-grid">
          <motion.div
            className="profile-info-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="info-card-header">
              <h3>Personal Information</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </div>

            <div className="info-fields">
              <div className="info-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{user.name}</p>
                )}
              </div>

              <div className="info-field">
                <label>Email Address</label>
                <p className="non-editable">{user.email}</p>
              </div>

              {userType === 'student' && (
                <>
                  <div className="info-field-row">
                    <div className="info-field">
                      <label>Year</label>
                      {isEditing ? (
                        <select name="year" value={formData.year} onChange={handleInputChange}>
                          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      ) : (
                        <p>{user.year}</p>
                      )}
                    </div>
                    <div className="info-field">
                      <label>Section</label>
                      {isEditing ? (
                        <select name="section" value={formData.section} onChange={handleInputChange}>
                          {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <p>{user.section}</p>
                      )}
                    </div>
                  </div>
                  <div className="info-field">
                    <label>Branch</label>
                    {isEditing ? (
                      <select name="branch" value={formData.branch} onChange={handleInputChange}>
                        {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    ) : (
                      <p>{user.branch}</p>
                    )}
                  </div>
                </>
              )}

              {userType === 'driver' && (
                <div className="info-field">
                  <label>Auto Registration No.</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="auto_reg_no"
                      value={formData.auto_reg_no}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{user.auto_reg_no}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="profile-stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-box-icon" style={{ background: '#e8f5e9' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" width="24" height="24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="stat-box-info">
                  <span className="stat-box-label">Account Type</span>
                  <span className="stat-box-value">{userType === 'student' ? 'Student' : 'Driver'}</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-box-icon" style={{ background: '#e3f2fd' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2" width="24" height="24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="stat-box-info">
                  <span className="stat-box-label">User ID</span>
                  <span className="stat-box-value">#{user.id}</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-box-icon" style={{ background: '#fff3e0' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2" width="24" height="24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="stat-box-info">
                  <span className="stat-box-label">Status</span>
                  <span className="stat-box-value active-status">Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
