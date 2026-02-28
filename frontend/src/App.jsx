import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext/AuthContext';
import { SocketProvider } from './context/SocketContext/SocketContext';
import Navbar from './components/Navbar/Navbar';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
import AboutUs from './pages/AboutUs/AboutUs';
import Profile from './pages/Profile/Profile';
import PastRides from './pages/PastRides/PastRides';
import PastHorns from './pages/PastHorns/PastHorns';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function AppContent() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const { loading, isAuthenticated, userType } = useAuth();

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar onLoginClick={openLoginPopup} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Landing onLoginClick={openLoginPopup} />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/past-rides" element={isAuthenticated && userType === 'driver' ? <PastRides /> : <Navigate to="/" />} />
        <Route path="/past-horns" element={isAuthenticated && userType === 'student' ? <PastHorns /> : <Navigate to="/" />} />
      </Routes>
      <LoginPopup isOpen={isLoginPopupOpen} onClose={closeLoginPopup} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
