import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          AutoRide
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/')}`} 
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/about-us" 
              className={`nav-link ${isActive('/about-us')}`} 
              onClick={closeMenu}
            >
              About Us
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard')}`} 
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              </li>
              {userType === 'driver' && (
                <li className="nav-item">
                  <Link 
                    to="/past-rides" 
                    className={`nav-link ${isActive('/past-rides')}`} 
                    onClick={closeMenu}
                  >
                    My Rides
                  </Link>
                </li>
              )}
              {userType === 'student' && (
                <li className="nav-item">
                  <Link 
                    to="/past-horns" 
                    className={`nav-link ${isActive('/past-horns')}`} 
                    onClick={closeMenu}
                  >
                    My Horns
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile')}`} 
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              </li>
            </>
          )}
          <li className="nav-item nav-button-container">
            {isAuthenticated ? (
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button 
                className="nav-button login-btn" 
                onClick={() => {
                  onLoginClick();
                  closeMenu();
                }}
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
