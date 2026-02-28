import { useAuth } from '../../context/AuthContext/AuthContext';
import { useSocket } from '../../context/SocketContext/SocketContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, userType, user } = useAuth();
  const { 
    isConnected, 
    locationData, 
    checkpointData, 
    userStatus, 
    message,
    pressHorn, 
    stopHorn, 
    startRide, 
    endRide 
  } = useSocket();

  const handleHornClick = () => {
    if (userStatus.isActive) {
      stopHorn();
    } else {
      pressHorn();
    }
  };

  const handleRideClick = () => {
    if (userStatus.isActive) {
      endRide();
    } else {
      startRide();
    }
  };

  // Parse students from JSON if needed
  const parseStudents = (students) => {
    if (!students) return [];
    if (typeof students === 'string') {
      try {
        const parsed = JSON.parse(students);
        return parsed.filter(s => s.student_id !== null);
      } catch {
        return [];
      }
    }
    return Array.isArray(students) ? students.filter(s => s.student_id !== null) : [];
  };

  // Parse drivers from JSON if needed
  const parseDrivers = (drivers) => {
    if (!drivers) return [];
    if (typeof drivers === 'string') {
      try {
        const parsed = JSON.parse(drivers);
        return parsed.filter(d => d.driver_id !== null);
      } catch {
        return [];
      }
    }
    return Array.isArray(drivers) ? drivers.filter(d => d.driver_id !== null) : [];
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Message Display */}
        {message && (
          <div className={`message ${message.success ? 'success' : 'error'}`}>
            {message.message}
          </div>
        )}

        {/* Connection Status */}
        {isAuthenticated && (
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </div>
        )}

        {/* Action Buttons */}
        {isAuthenticated && (
          <div className="action-button-container">
            {userType === 'student' ? (
              <button 
                className={`action-btn ${userStatus.isActive ? 'stop-btn' : 'horn-btn'}`} 
                onClick={handleHornClick}
                disabled={!isConnected}
              >
                {userStatus.isActive ? '🛑 Stop' : '🔔 Horn'}
              </button>
            ) : userType === 'driver' ? (
              <button 
                className={`action-btn ${userStatus.isActive ? 'end-ride-btn' : 'start-ride-btn'}`} 
                onClick={handleRideClick}
                disabled={!isConnected}
              >
                {userStatus.isActive ? '🛑 End Ride' : '🚗 Start Ride'}
              </button>
            ) : null}
          </div>
        )}

        {/* Data Tables */}
        {isAuthenticated && (
          <div className="data-tables-container">
            {/* Locations Table */}
            <div className="table-section">
              <h2>📍 Active Students by Location</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Active Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationData.length > 0 ? (
                      locationData.map((location) => {
                        const students = parseStudents(location.students);
                        return (
                          <tr key={location.location_id}>
                            <td className="location-name">{location.location_name}</td>
                            <td>
                              {students.length > 0 ? (
                                <div className="user-list">
                                  {students.map((student, idx) => (
                                    <span key={idx} className="user-badge student-badge">
                                      {student.name} ({student.year} - {student.branch} - {student.section})
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="no-users">No active students</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="2" className="no-data">No location data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checkpoints Table */}
            <div className="table-section">
              <h2>🚗 Active Drivers by Checkpoint</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Checkpoint</th>
                      <th>Active Drivers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkpointData.length > 0 ? (
                      checkpointData.map((checkpoint) => {
                        const drivers = parseDrivers(checkpoint.drivers);
                        return (
                          <tr key={checkpoint.checkpoint_id}>
                            <td className="checkpoint-name">{checkpoint.checkpoint_name}</td>
                            <td>
                              {drivers.length > 0 ? (
                                <div className="user-list">
                                  {drivers.map((driver, idx) => (
                                    <span key={idx} className="user-badge driver-badge">
                                      {driver.name} ({driver.auto_reg_no})
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="no-users">No active drivers</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="2" className="no-data">No checkpoint data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Not Authenticated Message */}
        {!isAuthenticated && (
          <div className="welcome-message">
            <h1>Welcome to AutoRide</h1>
            <p>Login to access real-time ride communication</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
