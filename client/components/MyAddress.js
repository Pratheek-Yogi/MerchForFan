import React, { useState, useEffect } from 'react';
import './MyAddress.css';

const MyAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '', // Complete address as single string
        addressType: 'home',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/user/address', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setAddresses(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            alert('Error loading addresses: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            let response;

            if (editingAddress) {
                // Update existing address
                response = await fetch(`http://localhost:5000/api/user/address/${editingAddress._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                // Add new address
                response = await fetch('http://localhost:5000/api/user/address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(formData)
                });
            }

            const data = await response.json();
            
            if (data.success) {
                await fetchAddresses(); // Refresh the list
                resetForm();
                alert(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Error saving address: ' + error.message);
        }
    };

    const handleEdit = (address) => {
        setFormData({
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressType: address.addressType,
            isDefault: address.isDefault
        });
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/user/address/${addressId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-auth-token': token
                    }
                });

                const data = await response.json();
                
                if (data.success) {
                    await fetchAddresses(); // Refresh the list
                    alert('Address deleted successfully!');
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error deleting address:', error);
                alert('Error deleting address: ' + error.message);
            }
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user/address/${addressId}/default`, {
                method: 'PATCH',
                headers: {
                    'x-auth-token': token
                }
            });

            const data = await response.json();
            
            if (data.success) {
                await fetchAddresses(); // Refresh the list
                alert('Default address updated successfully!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            alert('Error setting default address: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            addressLine1: '',
            addressType: 'home',
            isDefault: false
        });
        setEditingAddress(null);
        setShowForm(false);
    };

    const getAddressTypeIcon = (type) => {
        switch (type) {
            case 'home': return 'fas fa-home';
            case 'work': return 'fas fa-briefcase';
            case 'other': return 'fas fa-map-marker-alt';
            default: return 'fas fa-map-marker-alt';
        }
    };

    const getAddressTypeColor = (type) => {
        switch (type) {
            case 'home': return '#ff6b6b';
            case 'work': return '#74b9ff';
            case 'other': return '#2ed573';
            default: return '#a4b0be';
        }
    };

    if (loading) {
        return (
            <div className="addresses-loading">
                <div className="loading-spinner"></div>
                <p>Loading your addresses...</p>
            </div>
        );
    }

    return (
        <div className="my-addresses">
            <div className="addresses-header">
                <div className="header-content">
                    <h1>My Addresses</h1>
                    <p>Manage your shipping and billing addresses</p>
                </div>
                <button 
                    className="add-address-btn"
                    onClick={() => setShowForm(true)}
                    disabled={addresses.length >= 2} // Max 2 addresses
                >
                    <i className="fas fa-plus"></i>
                    Add New Address
                </button>
            </div>

            {addresses.length >= 2 && (
                <div className="info-message">
                    <i className="fas fa-info-circle"></i>
                    Maximum 2 addresses allowed. Delete an existing address to add a new one.
                </div>
            )}

            {/* Address Form */}
            {showForm && (
                <div className="address-form-section">
                    <div className="form-card">
                        <div className="card-header">
                            <i className="fas fa-map-marker-alt"></i>
                            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <button 
                                className="close-form-btn"
                                onClick={resetForm}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="address-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Complete Address *</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                    placeholder="Enter complete address with city, state and pincode"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Address Type</label>
                                    <select
                                        name="addressType"
                                        value={formData.addressType}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="home">Home</option>
                                        <option value="work">Work</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleInputChange}
                                        />
                                        <span className="checkmark"></span>
                                        Set as default address
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="save-btn"
                                >
                                    {editingAddress ? 'Update Address' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Addresses List */}
            <div className="addresses-list">
                {addresses.length === 0 ? (
                    <div className="no-addresses">
                        <i className="fas fa-map-marker-alt"></i>
                        <h3>No addresses saved</h3>
                        <p>Add your first address to get started with faster checkout</p>
                        <button 
                            className="add-first-address-btn"
                            onClick={() => setShowForm(true)}
                        >
                            Add Your First Address
                        </button>
                    </div>
                ) : (
                    <div className="addresses-grid">
                        {addresses.map((address) => (
                            <div key={address._id} className="address-card">
                                {address.isDefault && (
                                    <div className="default-badge">
                                        <i className="fas fa-star"></i>
                                        Default Address
                                    </div>
                                )}
                                
                                <div className="address-header">
                                    <div className="address-type">
                                        <i 
                                            className={getAddressTypeIcon(address.addressType)}
                                            style={{ color: getAddressTypeColor(address.addressType) }}
                                        ></i>
                                        <span>{address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}</span>
                                    </div>
                                    <div className="address-actions">
                                        <button 
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(address)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(address._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="address-content">
                                    <h4>{address.fullName}</h4>
                                    <p className="phone">{address.phone}</p>
                                    <p className="address-text">
                                        {address.addressLine1}
                                    </p>
                                </div>

                                <div className="address-footer">
                                    {!address.isDefault && (
                                        <button 
                                            className="set-default-btn"
                                            onClick={() => setDefaultAddress(address._id)}
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="address-stats">
                <div className="stat-item">
                    <div className="stat-icon">
                        <i className="fas fa-home"></i>
                    </div>
                    <div className="stat-info">
                        <h4>{addresses.filter(a => a.addressType === 'home').length}</h4>
                        <span>Home Addresses</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">
                        <i className="fas fa-briefcase"></i>
                    </div>
                    <div className="stat-info">
                        <h4>{addresses.filter(a => a.addressType === 'work').length}</h4>
                        <span>Work Addresses</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-info">
                        <h4>{addresses.filter(a => a.isDefault).length}</h4>
                        <span>Default Address</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAddress;
