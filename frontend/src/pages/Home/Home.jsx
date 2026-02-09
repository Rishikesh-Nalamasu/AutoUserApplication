import { useAuth } from '../../context/AuthContext/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, userType, user } = useAuth();

  const handleHornClick = () => {
    // Will implement later
    console.log('Horn clicked by student:', user?.name);
  };

  const handleStartRideClick = () => {
    // Will implement later
    console.log('Start Ride clicked by driver:', user?.name);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {isAuthenticated && (
          <div className="action-button-container">
            {userType === 'student' ? (
              <button className="action-btn horn-btn" onClick={handleHornClick}>
                🔔 Horn
              </button>
            ) : userType === 'driver' ? (
              <button className="action-btn start-ride-btn" onClick={handleStartRideClick}>
                🚗 Start Ride
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
