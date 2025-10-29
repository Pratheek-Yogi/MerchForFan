import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
        setLoading(false);
    };

    const updateQuantity = (index, change) => {
        const updatedCart = [...cartItems];
        const newQuantity = updatedCart[index].quantity + change;

        if (newQuantity < 1) {
            removeFromCart(index);
            return;
        }

        if (newQuantity > 10) {
            alert('Maximum quantity per item is 10');
            return;
        }

        updatedCart[index].quantity = newQuantity;
        setCartItems(updatedCart);
        saveCart(updatedCart);
    };

    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        saveCart(updatedCart);
    };

    const saveCart = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return <div className="loading">Loading cart...</div>;
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <span className="cart-count">{calculateTotalItems()} items</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Browse our products and add items to your cart</p>
                        <button className="continue-shopping-btn"  onClick={() => window.location.href = '/'}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-section">
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-variant">Size: {item.size}</p>
                                        <p className="item-price">₹{Number(item.price).toLocaleString()}</p>
                                    </div>
                                    <div className="quantity-controls">
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(index, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(index, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="item-total">
                                        ₹{(Number(item.price) * item.quantity).toLocaleString()}
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeFromCart(index)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-card">
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Subtotal ({calculateTotalItems()} items)</span>
                                    <span>₹{calculateTotal().toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax</span>
                                    <span>₹{(calculateTotal() * 0.1).toLocaleString()}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <strong>Total</strong>
                                    <strong>₹{(calculateTotal() * 1.1).toLocaleString()}</strong>
                                </div>
                                <button 
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </button>
                                <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
