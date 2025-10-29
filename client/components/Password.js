import React, { useState } from 'react';
import './Password.css';

const Password = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.currentPassword && formData.newPassword && 
            formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSuccess(false);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setSuccess(false), 5000);
        }, 2000);
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        const strengthMap = {
            1: { label: 'Very Weak', color: '#ff4757' },
            2: { label: 'Weak', color: '#ff6b6b' },
            3: { label: 'Fair', color: '#ffa502' },
            4: { label: 'Good', color: '#2ed573' },
            5: { label: 'Strong', color: '#1dd1a1' }
        };

        return { strength, ...strengthMap[strength] };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    return (
        <div className="password-page">
            <div className="password-header">
                <div className="header-content">
                    <h1>Change Password</h1>
                    <p>Secure your account with a new password</p>
                </div>
                <div className="security-badge">
                    <i className="fas fa-shield-alt"></i>
                    <span>High Security</span>
                </div>
            </div>

            {success && (
                <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    Password updated successfully!
                </div>
            )}

            <div className="password-content">
                <div className="password-form-section">
                    <div className="form-card">
                        <div className="card-header">
                            <i className="fas fa-lock"></i>
                            <h3>Update Your Password</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="password-form">
                            {/* Current Password */}
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.current ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                                        placeholder="Enter your current password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('current')}
                                    >
                                        <i className={`fas ${showPassword.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <span className="error-message">{errors.currentPassword}</span>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.newPassword ? 'error' : ''}`}
                                        placeholder="Create a new password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('new')}
                                    >
                                        <i className={`fas ${showPassword.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                
                                {/* Password Strength Meter */}
                                {formData.newPassword && (
                                    <div className="password-strength">
                                        <div className="strength-meter">
                                            <div 
                                                className="strength-bar"
                                                style={{
                                                    width: `${(passwordStrength.strength / 5) * 100}%`,
                                                    backgroundColor: passwordStrength.color
                                                }}
                                            ></div>
                                        </div>
                                        <span 
                                            className="strength-label"
                                            style={{ color: passwordStrength.color }}
                                        >
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}

                                {errors.newPassword && (
                                    <span className="error-message">{errors.newPassword}</span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                        placeholder="Confirm your new password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                    >
                                        <i className={`fas ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="error-message">{errors.confirmPassword}</span>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="password-requirements">
                                <h4>Password Requirements:</h4>
                                <ul>
                                    <li className={formData.newPassword.length >= 8 ? 'met' : ''}>
                                        <i className={`fas ${formData.newPassword.length >= 8 ? 'fa-check' : 'fa-circle'}`}></i>
                                        At least 8 characters
                                    </li>
                                    <li className={/[a-z]/.test(formData.newPassword) ? 'met' : ''}>
                                        <i className={`fas ${/[a-z]/.test(formData.newPassword) ? 'fa-check' : 'fa-circle'}`}></i>
                                        One lowercase letter
                                    </li>
                                    <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                                        <i className={`fas ${/[A-Z]/.test(formData.newPassword) ? 'fa-check' : 'fa-circle'}`}></i>
                                        One uppercase letter
                                    </li>
                                    <li className={/[0-9]/.test(formData.newPassword) ? 'met' : ''}>
                                        <i className={`fas ${/[0-9]/.test(formData.newPassword) ? 'fa-check' : 'fa-circle'}`}></i>
                                        One number
                                    </li>
                                </ul>
                            </div>

                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-key"></i>
                                        Update Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Security Tips */}
                <div className="security-tips-section">
                    <div className="tips-card">
                        <div className="card-header">
                            <i className="fas fa-lightbulb"></i>
                            <h3>Security Tips</h3>
                        </div>
                        <div className="tips-list">
                            <div className="tip-item">
                                <div className="tip-icon">
                                    <i className="fas fa-sync-alt"></i>
                                </div>
                                <div className="tip-content">
                                    <h4>Regular Updates</h4>
                                    <p>Change your password every 3-6 months</p>
                                </div>
                            </div>

                            <div className="tip-item">
                                <div className="tip-icon">
                                    <i className="fas fa-unique"></i>
                                </div>
                                <div className="tip-content">
                                    <h4>Unique Passwords</h4>
                                    <p>Use different passwords for different accounts</p>
                                </div>
                            </div>

                            <div className="tip-item">
                                <div className="tip-icon">
                                    <i className="fas fa-user-secret"></i>
                                </div>
                                <div className="tip-content">
                                    <h4>Avoid Personal Info</h4>
                                    <p>Don't use easily guessable information</p>
                                </div>
                            </div>

                            <div className="tip-item">
                                <div className="tip-icon">
                                    <i className="fas fa-tools"></i>
                                </div>
                                <div className="tip-content">
                                    <h4>Password Manager</h4>
                                    <p>Consider using a password manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Password;