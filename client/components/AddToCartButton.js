import React, { useState } from 'react';
import './AddToCartButton.css';
import { triggerCartUpdate } from './CartIcon';
import { getProductImage } from './imageUtils';

const AddToCartButton = ({ product, onAddToCart }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleAddToCart = () => {
        // Reset messages
        setError('');
        setShowSuccess(false);

        // Validation
        if (!product.selectedSize) {
            setError('Please select a size');
            return;
        }

        if (product.quantity < 1 || product.quantity > 10) {
            setError('Please enter a valid quantity (1-10)');
            return;
        }

        // Get current cart from localStorage
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Create cart item
        const cartItem = {
            id: product._id || product.id,
            name: product.ProductName || product.name,
            price: parseInt(product.Price?.replace(/[^0-9]/g, '') || product.price),
            size: product.selectedSize,
            quantity: product.quantity,
            image: getProductImage(product.Category, product.numericId)
        };

        // Check if item with same size already exists
        const existingItemIndex = currentCart.findIndex(item => 
            item.id === cartItem.id && item.size === product.selectedSize
        );

        let updatedCart;
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            updatedCart = [...currentCart];
            const newQuantity = updatedCart[existingItemIndex].quantity + product.quantity;
            
            if (newQuantity > 10) {
                setError('Maximum quantity per item is 10');
                return;
            }
            
            updatedCart[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item
            updatedCart = [...currentCart, cartItem];
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Trigger cart icon update
        triggerCartUpdate();

        // Show success message
        setShowSuccess(true);
        
        // Call callback function if provided
        if (onAddToCart) {
            onAddToCart(cartItem, updatedCart);
        }

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const productPrice = parseInt(product.Price?.replace(/[^0-9]/g, '') || product.price);
    const totalPrice = productPrice * product.quantity;

    return (
        <div className="add-to-cart-widget">
            {/* Add to Cart Button */}
            <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
            >
                <i className="fas fa-shopping-cart"></i>
                Add to Cart - ₹{totalPrice.toLocaleString()}
            </button>

            {/* Success Message */}
            {showSuccess && (
                <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    Item added to cart successfully!
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}
        </div>
    );
};

export default AddToCartButton;