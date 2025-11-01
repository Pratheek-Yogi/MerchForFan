import React, { useState, useEffect } from 'react';
import API_URL from '../config/apiConfig';
import './ShippingTracker.css';

const ShippingTracker = () => {
    const [trackingId, setTrackingId] = useState('');
    const [shipmentData, setShipmentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentTrackings, setRecentTrackings] = useState([]);

    // Load recent trackings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentShiprocketTrackings');
        if (saved) {
            setRecentTrackings(JSON.parse(saved));
        }
    }, []);

    // Save to recent trackings
    const saveToRecent = (trackingId, data) => {
        const newTracking = {
            id: trackingId,
            awb: data.awb_code,
            status: data.current_status,
            date: new Date().toISOString(),
            courier: data.courier_name
        };

        const updated = [newTracking, ...recentTrackings.filter(t => t.id !== trackingId)].slice(0, 5);
        setRecentTrackings(updated);
        localStorage.setItem('recentShiprocketTrackings', JSON.stringify(updated));
    };

    const trackShipment = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) {
            setError('Please enter a tracking ID');
            return;
        }

        setLoading(true);
        setError('');
        setShipmentData(null);

        try {
            // Replace with your actual ShipRocket API endpoint
            const response = await fetch(`${API_URL}/shiprocket/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tracking_id: trackingId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tracking information');
            }

            const data = await response.json();
            
            if (data.success) {
                setShipmentData(data.data);
                saveToRecent(trackingId, data.data);
            } else {
                throw new Error(data.message || 'Tracking information not found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'delivered': '#22c55e',
            'in transit': '#3b82f6',
            'out for delivery': '#8b5cf6',
            'pending': '#f59e0b',
            'cancelled': '#ef4444',
            'returned': '#6b7280',
            'rto': '#dc2626'
        };
        return statusColors[status?.toLowerCase()] || '#6b7280';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearRecent = () => {
        setRecentTrackings([]);
        localStorage.removeItem('recentShiprocketTrackings');
    };

    return (
        <div className="shipping-tracker">
            {/* Header */}
            <div className="tracker-header">
                <h1>Track Your Shipment</h1>
                <p>Enter your ShipRocket tracking ID to get real-time updates</p>
            </div>

            {/* Search Form */}
            <div className="tracker-search">
                <form onSubmit={trackShipment} className="search-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="Enter ShipRocket Tracking ID"
                            className="tracking-input"
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="track-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner">⏳</span>
                            ) : (
                                'Track Shipment'
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}
            </div>

            {/* Recent Trackings */}
            {recentTrackings.length > 0 && (
                <div className="recent-trackings">
                    <div className="recent-header">
                        <h3>Recently Tracked</h3>
                        <button onClick={clearRecent} className="clear-btn">
                            Clear All
                        </button>
                    </div>
                    <div className="recent-list">
                        {recentTrackings.map((tracking, index) => (
                            <div 
                                key={index} 
                                className="recent-item"
                                onClick={() => setTrackingId(tracking.id)}
                            >
                                <div className="recent-awb">{tracking.awb || tracking.id}</div>
                                <div 
                                    className="recent-status"
                                    style={{ color: getStatusColor(tracking.status) }}
                                >
                                    {tracking.status}
                                </div>
                                <div className="recent-courier">{tracking.courier}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shipment Details */}
            {shipmentData && (
                <div className="shipment-details">
                    {/* Summary Card */}
                    <div className="summary-card">
                        <div className="summary-header">
                            <h2>Shipment Summary</h2>
                            <div 
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(shipmentData.current_status) }}
                            >
                                {shipmentData.current_status}
                            </div>
                        </div>
                        
                        <div className="summary-grid">
                            <div className="summary-item">
                                <label>AWB Number</label>
                                <span className="value">{shipmentData.awb_code}</span>
                            </div>
                            <div className="summary-item">
                                <label>Courier</label>
                                <span className="value">{shipmentData.courier_name}</span>
                            </div>
                            <div className="summary-item">
                                <label>Order Date</label>
                                <span className="value">{formatDate(shipmentData.order_date)}</span>
                            </div>
                            <div className="summary-item">
                                <label>Expected Delivery</label>
                                <span className="value">
                                    {shipmentData.etd ? formatDate(shipmentData.etd) : 'Not available'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="timeline-card">
                        <h3>Tracking History</h3>
                        <div className="timeline">
                            {shipmentData.shipment_track_activities?.length > 0 ? (
                                shipmentData.shipment_track_activities.map((activity, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <div className="timeline-status">{activity.status}</div>
                                            <div className="timeline-date">
                                                {formatDate(activity.date)}
                                            </div>
                                            {activity.location && (
                                                <div className="timeline-location">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    {activity.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-activity">
                                    No tracking activities available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipment Information */}
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>Sender Details</h4>
                            <div className="info-content">
                                <p><strong>Name:</strong> {shipmentData.seller_name}</p>
                                <p><strong>Phone:</strong> {shipmentData.seller_phone}</p>
                                <p><strong>Address:</strong> {shipmentData.pickup_location}</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <h4>Receiver Details</h4>
                            <div className="info-content">
                                <p><strong>Name:</strong> {shipmentData.recipient_name}</p>
                                <p><strong>Phone:</strong> {shipmentData.recipient_phone}</p>
                                <p><strong>Address:</strong> {shipmentData.delivery_address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="help-section">
                <h3>Need Help?</h3>
                <div className="help-options">
                    <div className="help-item">
                        <i className="fas fa-phone"></i>
                        <span>Customer Support: 1800-123-4567</span>
                    </div>
                    <div className="help-item">
                        <i className="fas fa-envelope"></i>
                        <span>Email: support@shiprocket.com</span>
                    </div>
                    <div className="help-item">
                        <i className="fas fa-question-circle"></i>
                        <span>Tracking ID not working? Contact us</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingTracker;
