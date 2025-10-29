import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import GoogleSignIn from './GoogleSignIn';
import sessionManager from '../utils/sessionManager';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const validateForm = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 1) {
      setMessage('Please enter your password');
      return false;
    }

    return true;
  };

  const handleGoogleSuccess = (data) => {
    setMessage('Login successful! Redirecting...');
    setLoading(false);
    
    // Use the actual token from backend response
    if (data.user && data.token) {
      sessionManager.createSession(data.user, data.token);
      
      // Use navigate instead of window.location for better SPA experience
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    }
  };

  const handleGoogleError = (error) => {
    setMessage(`Login error: ${error}`);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Login successful! Redirecting...');
        
        // Clear form
        setFormData({
          email: '',
          password: ''
        });
        
        // Use the actual user data and token from backend
        if (data.user && data.token) {
          sessionManager.createSession(data.user, data.token);
          
          // Redirect using React Router for better UX
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        }
        
        console.log('Login successful:', data);
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ADDED: Missing auth-form-center-wrapper for proper centering */}
      <div className="auth-form-center-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your Merch Fan account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {message && (
              <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <GoogleSignIn 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={loading}
          />

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
            <p><Link to="/forgot-password">Forgot your password?</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;