import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [orderSummary, setOrderSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [placingOrder, setPlacingOrder] = useState(false);

    // Load addresses and cart items
    useEffect(() => {
        loadCartItems();
        fetchAddresses();
    }, []);

    const loadCartItems = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
        calculateOrderSummary(savedCart);
    };

    const calculateOrderSummary = (items) => {
        const subtotal = items.reduce((total, item) => {
            const price = Number(item.price) || 0;
            return total + (price * item.quantity);
        }, 0);
        
        const shipping = subtotal > 500 ? 0 : 50;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;

        setOrderSummary({
            items: items.map(item => ({
                product: item.id, // This will be the product ID
                name: item.name,
                quantity: item.quantity,
                price: Number(item.price),
                size: item.size // Include size in items
            })),
            subtotal: Math.round(subtotal),
            shipping: shipping,
            tax: Math.round(tax),
            total: Math.round(total)
        });
    };

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.log('No token found');
                setLoading(false);
                return;
            }

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
                // Set default address if available
                const defaultAddress = data.data.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress);
                } else if (data.data.length > 0) {
                    setSelectedAddress(data.data[0]);
                }
            } else {
                throw new Error(data.message || 'Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !selectedPayment) {
            alert('Please select address and payment method');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setPlacingOrder(true);

        try {
            if (selectedPayment === 'razorpay') {
                await handleRazorpayPayment();
            } else if (selectedPayment === 'cod') {
                await placeOrder('cod');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order: ' + error.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleRazorpayPayment = async () => {
        // For now, we'll simulate Razorpay payment
        const paymentSuccess = window.confirm('Mock Razorpay payment: Click OK to simulate successful payment');
        if (paymentSuccess) {
            await placeOrder('razorpay', 'razorpay_pay_' + Date.now());
        } else {
            throw new Error('Payment cancelled');
        }
    };

    const placeOrder = async (paymentMethod, paymentId = null) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('User not authenticated');
            }

            // Generate order ID
            const orderId = 'ORD' + Date.now();

            const orderData = {
                orderId: orderId,
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    address: selectedAddress.addressLine1,
                    type: selectedAddress.addressType
                },
                items: orderSummary.items,
                totalAmount: orderSummary.total,
                paymentStatus: paymentMethod === 'cod' ? 'Unpaid' : 'Paid',
                status: 'Pending'
            };

            // Save order to database using your existing route
            const response = await fetch('http://localhost:5000/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (data.success) {
                // Clear cart after successful order
                localStorage.removeItem('cart');
                setCartItems([]);
                
                // Redirect to order confirmation page
                navigate(`/order-confirmation/${data.orderId}`, {
                    state: {
                        orderNumber: data.orderId,
                        totalAmount: orderSummary.total
                    }
                });
            } else {
                throw new Error(data.message || 'Failed to create order');
            }

        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    };

    const saveNewAddress = async (newAddress) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/user/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    fullName: newAddress.name,
                    phone: newAddress.phone,
                    addressLine1: newAddress.address,
                    addressType: newAddress.type,
                    isDefault: newAddress.isDefault
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Refresh addresses to get updated list
                await fetchAddresses();
                setShowAddressModal(false);
                alert('Address added successfully!');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Error saving address: ' + error.message);
        }
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
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="loading">Loading checkout...</div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !placingOrder) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to your cart before checkout</p>
                        <button 
                            className="continue-shopping-btn"
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <p>Complete your purchase</p>
                </div>

                {/* Checkout Steps */}
                <div className="checkout-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-text">Address</div>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-text">Payment</div>
                    </div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-text">Confirmation</div>
                    </div>
                </div>

                <div className="checkout-content">
                    {/* Left Column - Forms */}
                    <div className="checkout-forms">
                        {/* Address Section */}
                        <div className="checkout-section">
                            <div className="section-header">
                                <h3>Delivery Address</h3>
                                <button 
                                    className="edit-btn" 
                                    onClick={() => setShowAddressModal(true)}
                                    disabled={addresses.length >= 2}
                                >
                                    Add New Address
                                </button>
                            </div>
                            
                            {addresses.length === 0 ? (
                                <div className="no-addresses">
                                    <p>No addresses found. Please add a delivery address.</p>
                                    <button 
                                        className="continue-shopping-btn"
                                        onClick={() => setShowAddressModal(true)}
                                    >
                                        Add Address
                                    </button>
                                </div>
                            ) : (
                                <div className="addresses-container">
                                    {addresses.map(address => (
                                        <div
                                            key={address._id}
                                            className={`address-card ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedAddress(address)}
                                        >
                                            {address.isDefault && (
                                                <div className="default-badge">
                                                    <i className="fas fa-star"></i>
                                                    Default
                                                </div>
                                            )}
                                            
                                            <div className="address-type-badge">
                                                <i 
                                                    className={getAddressTypeIcon(address.addressType)}
                                                    style={{ color: getAddressTypeColor(address.addressType) }}
                                                ></i>
                                                <span>{address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}</span>
                                            </div>
                                            
                                            <div className="address-details">
                                                <div className="address-name">{address.fullName}</div>
                                                <div className="address-phone">{address.phone}</div>
                                                <div className="address-text">{address.addressLine1}</div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {addresses.length < 2 && (
                                        <div className="add-new-address" onClick={() => setShowAddressModal(true)}>
                                            <i className="fas fa-plus"></i>
                                            Add New Address
                                        </div>
                                    )}
                                </div>
                            )}

                            {addresses.length >= 2 && (
                                <div className="info-message">
                                    <i className="fas fa-info-circle"></i>
                                    Maximum 2 addresses reached
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className="checkout-section">
                            <div className="section-header">
                                <h3>Payment Method</h3>
                            </div>
                            
                            <div className="payment-methods">
                                <div
                                    className={`payment-method ${selectedPayment === 'razorpay' ? 'selected' : ''}`}
                                    onClick={() => setSelectedPayment('razorpay')}
                                >
                                    <div className="payment-icon">RP</div>
                                    <div className="payment-details">
                                        <div className="payment-name">Razorpay</div>
                                        <div className="payment-description">Pay securely with UPI, Card, Net Banking</div>
                                    </div>
                                </div>
                                
                                <div
                                    className={`payment-method ${selectedPayment === 'cod' ? 'selected' : ''}`}
                                    onClick={() => setSelectedPayment('cod')}
                                >
                                    <div className="payment-icon">COD</div>
                                    <div className="payment-details">
                                        <div className="payment-name">Cash on Delivery</div>
                                        <div className="payment-description">Pay when you receive your order</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="order-summary">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            
                            {orderSummary && (
                                <>
                                    <div className="order-items">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <div className="item-image">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                                <div className="item-info">
                                                    <div className="item-name">{item.name}</div>
                                                    <div className="item-variant">Size: {item.size}</div>
                                                    <div className="item-quantity">Qty: {item.quantity}</div>
                                                </div>
                                                <div className="item-price">₹{Number(item.price).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="summary-totals">
                                        <div className="summary-row">
                                            <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                                            <span>₹{orderSummary.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Shipping:</span>
                                            <span>{orderSummary.shipping === 0 ? 'Free' : `₹${orderSummary.shipping}`}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Tax:</span>
                                            <span>₹{orderSummary.tax.toLocaleString()}</span>
                                        </div>
                                        <div className="summary-divider"></div>
                                        <div className="summary-row total">
                                            <span>Total:</span>
                                            <span>₹{orderSummary.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        className="place-order-btn"
                                        onClick={handlePlaceOrder}
                                        disabled={!selectedAddress || !selectedPayment || addresses.length === 0 || placingOrder}
                                    >
                                        {placingOrder ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            {showAddressModal && (
                <AddressModal
                    onClose={() => setShowAddressModal(false)}
                    onSave={saveNewAddress}
                    addressesCount={addresses.length}
                />
            )}
        </div>
    );
};

// Address Modal Component
const AddressModal = ({ onClose, onSave, addressesCount }) => {
    const [formData, setFormData] = useState({
        type: 'home',
        name: '',
        phone: '',
        address: '',
        isDefault: addressesCount === 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
            alert('Please fill all required fields');
            return;
        }
        onSave(formData);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="address-modal">
                <div className="modal-header">
                    <h3>Add New Address</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <form className="address-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Address Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="form-input"
                        >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
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
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Enter complete address with city, state and pincode"
                        />
                    </div>
                    
                    <div className="checkbox-group">
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
                    
                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;