import { useState } from 'react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [loginType, setLoginType] = useState(null); // 'student' or 'driver'
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    year: '',
    branch: '',
    section: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const yearOptions = ['1st', '2nd', '3rd', '4th'];
  const branchOptions = ['Computer Science', 'Data Science', 'AI/ML', 'Civil', 'Mechanical'];
  const sectionOptions = ['A', 'B', 'C', 'D'];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(loginForm.email, loginForm.password, loginType);

    if (result.success) {
      resetForms();
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await signup({
      name: signupForm.name,
      year: signupForm.year,
      branch: signupForm.branch,
      section: signupForm.section,
      email: signupForm.email,
      password: signupForm.password
    });

    if (result.success) {
      resetForms();
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const resetForms = () => {
    setLoginType(null);
    setIsSignup(false);
    setError('');
    setLoginForm({ email: '', password: '' });
    setSignupForm({
      name: '',
      year: '',
      branch: '',
      section: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleBack = () => {
    if (isSignup) {
      setIsSignup(false);
    } else {
      setLoginType(null);
    }
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose}>&times;</button>

        {/* Type Selection */}
        {!loginType && (
          <div className="login-type-selection">
            <h2>Login As</h2>
            <div className="type-buttons">
              <button 
                className="type-btn student-btn"
                onClick={() => setLoginType('student')}
              >
                <span className="type-icon">🎓</span>
                Student
              </button>
              <button 
                className="type-btn driver-btn"
                onClick={() => setLoginType('driver')}
              >
                <span className="type-icon">🚗</span>
                Driver
              </button>
            </div>
          </div>
        )}

        {/* Student Login/Signup */}
        {loginType === 'student' && (
          <div className="login-form-container">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h2>{isSignup ? 'Student Sign Up' : 'Student Login'}</h2>
            
            {error && <div className="error-message">{error}</div>}

            {!isSignup ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      value={signupForm.year}
                      onChange={(e) => setSignupForm({...signupForm, year: e.target.value})}
                      required
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <select
                      value={signupForm.section}
                      onChange={(e) => setSignupForm({...signupForm, section: e.target.value})}
                      required
                    >
                      <option value="">Select Section</option>
                      {sectionOptions.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select
                    value={signupForm.branch}
                    onChange={(e) => setSignupForm({...signupForm, branch: e.target.value})}
                    required
                  >
                    <option value="">Select Branch</option>
                    {branchOptions.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    required
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            )}

            <div className="switch-form">
              {!isSignup ? (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => { setIsSignup(true); setError(''); }}>
                    Create New
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => { setIsSignup(false); setError(''); }}>
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Driver Login */}
        {loginType === 'driver' && (
          <div className="login-form-container">
            <button className="back-btn" onClick={handleBack}>← Back</button>
            <h2>Driver Login</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
