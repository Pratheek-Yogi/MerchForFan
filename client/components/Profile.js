import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setUser(data.data);
                setFormData(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            
            // Prepare data for backend
            const updateData = {
                firstName: formData.firstName || formData.name?.split(' ')[0] || '',
                lastName: formData.lastName || formData.name?.split(' ').slice(1).join(' ') || '',
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                avatar: formData.avatar,
                emailNotifications: formData.emailNotifications,
                smsNotifications: formData.smsNotifications
            };

            const response = await fetch('http://localhost:5000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.data);
                setIsEditing(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
        setError('');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePreferenceChange = (preference, value) => {
        setFormData(prev => ({
            ...prev,
            [preference]: value
        }));
    };

    if (loading && !user) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="profile-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button onClick={fetchUserData} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>No user data available</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="header-content">
                    <h1>My Profile</h1>
                    <p>Manage your personal information and preferences</p>
                </div>
                <div className="header-actions">
                    {!isEditing ? (
                        <button 
                            className="edit-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            <i className="fas fa-edit"></i>
                            Edit Profile
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button 
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                className="save-btn"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {saveSuccess && (
                <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    Profile updated successfully!
                </div>
            )}

            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

            <div className="profile-content">
                {/* Avatar Section */}
                <div className="profile-section">
                    <div className="section-header">
                        <i className="fas fa-user-circle"></i>
                        <h3>Profile Picture</h3>
                    </div>
                    <div className="avatar-section">
                        <div className="avatar-container">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Profile" className="avatar-image" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {formData.firstName?.charAt(0)?.toUpperCase() || formData.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            {isEditing && (
                                <label className="avatar-upload-btn">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange}
                                    />
                                    <i className="fas fa-camera"></i>
                                </label>
                            )}
                        </div>
                        <div className="avatar-info">
                            <p>Upload a clear photo of yourself for better recognition</p>
                            <span>JPG, PNG max 5MB</span>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="profile-section">
                    <div className="section-header">
                        <i className="fas fa-info-circle"></i>
                        <h3>Personal Information</h3>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <div className="display-value">{user.firstName || 'Not set'}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <div className="display-value">{user.lastName || 'Not set'}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <div className="display-value">{user.email || 'Not set'}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <div className="display-value">{user.phone || 'Not set'}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            ) : (
                                <div className="display-value">
                                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            {isEditing ? (
                                <select
                                    name="gender"
                                    value={formData.gender || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            ) : (
                                <div className="display-value">
                                    {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Stats */}
                {!isEditing && (
                    <div className="profile-section">
                        <div className="section-header">
                            <i className="fas fa-chart-line"></i>
                            <h3>Account Overview</h3>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Member Since</h4>
                                    <p>{user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    }) : 'Not available'}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon orders">
                                    <i className="fas fa-shopping-bag"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Orders</h4>
                                    <p>{user.totalOrders || '0'} Orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preferences */}
                <div className="profile-section">
                    <div className="section-header">
                        <i className="fas fa-cog"></i>
                        <h3>Preferences</h3>
                    </div>
                    <div className="preferences">
                        <div className="preference-item">
                            <div className="preference-info">
                                <h4>Email Notifications</h4>
                                <p>Receive updates about orders and promotions</p>
                            </div>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={formData.emailNotifications || false}
                                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                    disabled={!isEditing}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="preference-item">
                            <div className="preference-info">
                                <h4>SMS Notifications</h4>
                                <p>Get order updates via SMS</p>
                            </div>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={formData.smsNotifications || false}
                                    onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                                    disabled={!isEditing}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
