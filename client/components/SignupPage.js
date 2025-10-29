import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import GoogleSignIn from './GoogleSignIn';
import sessionManager from '../utils/sessionManager';

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }

    // Name validation
    if (formData.firstName.trim().length < 2) {
      setMessage('First name must be at least 2 characters long');
      return false;
    }

    if (formData.lastName.trim().length < 2) {
      setMessage('Last name must be at least 2 characters long');
      return false;
    }

    return true;
  };

  const handleGoogleSuccess = (data) => {
    setMessage('Account created successfully! Redirecting...');
    setLoading(false);
    
    // Use the actual token from backend response
    if (data.user && data.token) {
      sessionManager.createSession(data.user, data.token);
      
      // Use navigate instead of window.location for better SPA experience
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  const handleGoogleError = (error) => {
    setMessage(`Signup error: ${error}`);
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Account created successfully! Redirecting...');
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Use the actual user data and token from backend
        if (data.user && data.token) {
          sessionManager.createSession(data.user, data.token);
          
          // Redirect using React Router for better UX
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // Fallback: redirect to login if no session created
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      } else {
        setMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-center-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Join Merch Fan</h1>
            <p>Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="First name"
                  minLength="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Last name"
                  minLength="2"
                />
              </div>
            </div>

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
                placeholder="Create a password (min. 6 characters)"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Confirm your password"
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
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
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            <p className="terms-notice">
              By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;