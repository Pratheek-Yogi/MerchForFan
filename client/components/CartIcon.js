import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartIcon.css';

const CartIcon = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        updateCartCount();
        // Listen for cart updates
        const handleCartUpdate = () => updateCartCount();
        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
    };

    return (
        <Link to="/cart" className="cart-icon-link">
            <div className="cart-icon-wrapper">
                <i className="fas fa-shopping-cart cart-icon-main"></i>
                {cartCount > 0 && (
                    <span className="cart-badge">
                        {cartCount}
                    </span>
                )}
            </div>
        </Link>
    );
};

// Function to trigger cart updates from other components
export const triggerCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
};

export default CartIcon;