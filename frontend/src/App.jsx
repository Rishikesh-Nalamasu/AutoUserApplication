import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext/AuthContext';
import { SocketProvider } from './context/SocketContext/SocketContext';
import Navbar from './components/Navbar/Navbar';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import './App.css';

function AppContent() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const { loading } = useAuth();

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
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
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
