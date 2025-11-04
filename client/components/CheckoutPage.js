import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/apiConfig';
import './CheckoutPage.css';

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

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
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        addressType: 'Home',
    });

    // Load addresses, cart items, and Razorpay script
    useEffect(() => {
        loadCartItems();
        fetchAddresses();
        initializeRazorpay();
    }, []);

    const initializeRazorpay = async () => {
        const loaded = await loadRazorpayScript();
        setRazorpayLoaded(loaded);
        if (!loaded) {
            console.error('Failed to load Razorpay SDK');
        }
    };

    const loadCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
        calculateOrderSummary(cart);
        setLoading(false);
    };

    const calculateOrderSummary = (items) => {
        if (items.length === 0) {
            setOrderSummary(null);
            return;
        }
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = subtotal > 1000 ? 0 : 50; // Example: Free shipping over 1000
        const total = subtotal + shipping;
        setOrderSummary({
            items,
            subtotal,
            shipping,
            total,
        });
    };

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_URL}/address`, {
                headers: { 'x-auth-token': token },
            });
            const data = await response.json();
            if (data.success) {
                setAddresses(data.data);
                if (data.data.length > 0) {
                    setSelectedAddress(data.data[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    const handleAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(newAddress),
            });
            const data = await response.json();
            if (data.success) {
                fetchAddresses();
                setShowAddressModal(false);
            } else {
                alert('Failed to save address: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Error saving address.');
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
        if (!razorpayLoaded) {
            alert('Payment gateway is not loaded. Please try again.');
            return;
        }
        if (!orderSummary) {
            alert('Order summary is not available.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const orderId = 'ORD' + Date.now();

            const orderData = {
                orderId: orderId,
                amount: orderSummary.total * 100,
                currency: 'INR',
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    address: selectedAddress.addressLine1,
                    type: selectedAddress.addressType,
                },
                items: orderSummary.items,
            };

            const response = await fetch(`${API_URL}/orders/create-razorpay-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to create payment order');
            }

            const razorpayOrderId = data.razorpayOrderId;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: orderSummary.total * 100,
                currency: 'INR',
                name: 'MerchForFan',
                description: `Order for ${orderSummary.items.length} items`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData: orderData,
                        });
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: selectedAddress.fullName,
                    contact: selectedAddress.phone,
                    email: localStorage.getItem('userEmail') || '',
                },
                notes: {
                    address: selectedAddress.addressLine1,
                    order_id: orderId,
                },
                theme: {
                    color: '#4f46e5',
                },
                modal: {
                    ondismiss: function () {
                        console.log('Payment modal dismissed');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Razorpay payment error:', error);
            throw error;
        }
    };

    const verifyPayment = async (paymentData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/orders/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();
            if (data.success) {
                await placeOrder('razorpay', paymentData.razorpay_payment_id);
            } else {
                throw new Error(data.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
        }
    };

    const placeOrder = async (paymentMethod, paymentId = null) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated');

            const orderId = 'ORD' + Date.now();
            const orderData = {
                orderId: orderId,
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    address: selectedAddress.addressLine1,
                    type: selectedAddress.addressType,
                },
                items: orderSummary.items,
                totalAmount: orderSummary.total,
                paymentMethod: paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
                paymentId: paymentId,
                status: 'confirmed',
            };

            const response = await fetch(`${API_URL}/orders/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('cart');
                setCartItems([]);
                navigate(`/order-confirmation/${data.order._id || data.orderId}`, {
                    state: {
                        orderNumber: data.order.orderId || orderId,
                        totalAmount: orderSummary.total,
                        paymentMethod: paymentMethod,
                    },
                });
            } else {
                throw new Error(data.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    };

    if (loading) {
        return <div className="checkout-page-loading">Loading Checkout...</div>;
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-container">
                <div className="checkout-steps">
                    {/* Step 1: Shipping Address */}
                    <div className={`checkout-step ${currentStep === 1 ? 'active' : ''}`}>
                        <h2>1. Shipping Address</h2>
                        {addresses.map((addr) => (
                            <div key={addr._id} className={`address-card ${selectedAddress?._id === addr._id ? 'selected' : ''}`} onClick={() => setSelectedAddress(addr)}>
                                <strong>{addr.fullName}</strong> ({addr.addressType})<br />
                                {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}<br />
                                Phone: {addr.phone}
                            </div>
                        ))}
                        <button onClick={() => setShowAddressModal(true)} className="add-address-btn">Add New Address</button>
                        {currentStep === 1 && <button onClick={() => setCurrentStep(2)} disabled={!selectedAddress} className="next-step-btn">Next: Payment</button>}
                    </div>

                    {/* Step 2: Payment Method */}
                    <div className={`checkout-step ${currentStep === 2 ? 'active' : ''}`}>
                        <h2>2. Payment Method</h2>
                        {currentStep >= 2 && (
                            <div>
                                <div className="payment-option">
                                    <input type="radio" id="cod" name="payment" value="cod" onChange={(e) => setSelectedPayment(e.target.value)} />
                                    <label htmlFor="cod">Cash on Delivery (COD)</label>
                                </div>
                                <div className="payment-option">
                                    <input type="radio" id="razorpay" name="payment" value="razorpay" onChange={(e) => setSelectedPayment(e.target.value)} />
                                    <label htmlFor="razorpay">Pay with Razorpay</label>
                                </div>
                                <button onClick={() => setCurrentStep(1)} className="prev-step-btn">Back to Address</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    {orderSummary ? (
                        <>
                            {orderSummary.items.map(item => (
                                <div key={item._id} className="summary-item">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="summary-total">
                                <span>Subtotal</span>
                                <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-total">
                                <span>Shipping</span>
                                <span>₹{orderSummary.shipping.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="summary-total grand-total">
                                <span>Total</span>
                                <span>₹{orderSummary.total.toFixed(2)}</span>
                            </div>
                            <button onClick={handlePlaceOrder} disabled={placingOrder || !selectedAddress || !selectedPayment} className="place-order-btn">
                                {placingOrder ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
            </div>

            {showAddressModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>Add New Address</h2>
                        <form onSubmit={handleSaveAddress}>
                            <input name="fullName" placeholder="Full Name" onChange={handleAddressChange} required />
                            <input name="phone" placeholder="Phone Number" onChange={handleAddressChange} required />
                            <input name="addressLine1" placeholder="Address" onChange={handleAddressChange} required />
                            <input name="city" placeholder="City" onChange={handleAddressChange} required />
                            <input name="state" placeholder="State" onChange={handleAddressChange} required />
                            <input name="postalCode" placeholder="Postal Code" onChange={handleAddressChange} required />
                            <select name="addressType" onChange={handleAddressChange}>
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                            </select>
                            <div className="modal-actions">
                                <button type="submit">Save Address</button>
                                <button type="button" onClick={() => setShowAddressModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
