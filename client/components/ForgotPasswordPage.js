import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/apiConfig';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset code sent to your email!');
        setEmailSent(true);
        setIsSuccess(true);
        console.log('Reset code sent:', data);
      } else {
        setMessage(data.message || 'Failed to send reset code');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-center-wrapper"> {/* ADDED NEW WRAPPER HERE */}
        <div className="auth-container">
          <div className="auth-form">
            <h1>Reset Your Password</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a code to reset your password.
            </p>

            {!emailSent ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Check Your Email</h3>
                <p>We've sent a 6-digit reset code to <strong>{email}</strong></p>
                <p>Please check your inbox and enter the code below.</p>
                
                <div className="action-buttons">
                  <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className="auth-button">
                    Enter Reset Code
                  </Link>
                  <button 
                    onClick={() => {
                      setEmailSent(false);
                      setMessage('');
                      setEmail('');
                    }} 
                    className="auth-button secondary"
                  >
                    Try Different Email
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="auth-links">
              <Link to="/login">← Back to Login</Link>
              <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
          </div>
        </div>
      </div> {/* CLOSED NEW WRAPPER HERE */}
    </div>
  );
};

export default ForgotPasswordPage;
