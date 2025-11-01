import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCartItems();
        
        // Listen for cart updates from customizer
        const handleCartUpdate = () => {
            loadCartItems();
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const loadCartItems = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Loaded cart items:', savedCart); // Debug log
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

    const getItemPrice = (item) => {
        // Handle different price formats
        if (typeof item.price === 'number') {
            return item.price;
        }
        if (typeof item.price === 'string') {
            // Extract number from string like "₹799" or "799"
            const priceMatch = item.price.replace(/[^0-9.]/g, '');
            return Number(priceMatch) || 0;
        }
        if (item.Price) {
            const priceMatch = item.Price.replace(/[^0-9.]/g, '');
            return Number(priceMatch) || 0;
        }
        return 0;
    };

    const getItemName = (item) => {
        return item.name || item.ProductName || 'Custom Product';
    };

    const getItemSize = (item) => {
        return item.size || item.selectedSize || 'M';
    };

    const getItemImage = (item) => {
        return item.image || item.imageUrl || '/default-product.jpg';
    };

    const getItemId = (item) => {
        return item.id || item.numericId || item.customProductId || Math.random().toString();
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = getItemPrice(item);
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
                        <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-section">
                            {cartItems.map((item, index) => {
                                const itemPrice = getItemPrice(item);
                                const itemName = getItemName(item);
                                const itemSize = getItemSize(item);
                                const itemImage = getItemImage(item);
                                const itemId = getItemId(item);
                                
                                return (
                                    <div key={`${itemId}-${index}`} className="cart-item">
                                        <div className="item-image">
                                            <img 
                                                src={itemImage} 
                                                alt={itemName}
                                                onError={(e) => {
                                                    e.target.src = '/default-product.jpg';
                                                }}
                                            />
                                            {item.isCustomProduct && (
                                                <div className="custom-badge">Custom</div>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <h3 className="item-name">{itemName}</h3>
                                            <p className="item-variant">Size: {itemSize}</p>
                                            <p className="item-price">₹{itemPrice.toLocaleString()}</p>
                                            {item.isCustomProduct && item.customization && (
                                                <div className="custom-details">
                                                    <p className="custom-color">Color: {item.customization.baseColor.toUpperCase()}</p>
                                                    {item.customization.designImage && (
                                                        <p className="custom-design">With Custom Design</p>
                                                    )}
                                                </div>
                                            )}
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
                                            ₹{(itemPrice * item.quantity).toLocaleString()}
                                        </div>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeFromCart(index)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                );
                            })}
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
                                    <span>Tax (10%)</span>
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
                                <button className="continue-shopping-btn" onClick={() => navigate('/')}>
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