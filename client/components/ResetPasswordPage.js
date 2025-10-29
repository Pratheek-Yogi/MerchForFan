import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [email] = useState(searchParams.get('email') || '');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: formData.code,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully!');
        setPasswordReset(true);
        console.log('Password reset successful:', data);
      } else {
        setMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <div className="auth-page">
        <div className="auth-form-center-wrapper"> {/* ADDED NEW WRAPPER HERE */}
          <div className="auth-container">
            <div className="auth-form">
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h1>Password Reset Successful!</h1>
                <p>Your password has been successfully reset.</p>
                <p>You can now log in with your new password.</p>
                
                <div className="action-buttons">
                  <Link to="/login" className="auth-button">
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div> {/* CLOSED NEW WRAPPER HERE */}
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-form-center-wrapper"> {/* ADDED NEW WRAPPER HERE */}
        <div className="auth-container">
          <div className="auth-form">
            <h1>Enter Reset Code</h1>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="code">Reset Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  title="Please enter a 6-digit number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  minLength="6"
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="auth-links">
              <Link to="/forgot-password">← Back to Forgot Password</Link>
              <Link to="/login">Back to Login</Link>
            </div>
          </div>
        </div>
      </div> {/* CLOSED NEW WRAPPER HERE */}
    </div>
  );
};

export default ResetPasswordPage;
