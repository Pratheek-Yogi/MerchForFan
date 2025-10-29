const express = require('express');
const router = express.Router();

// Middleware (same as above)
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Get cart summary from your actual cart data
router.get('/summary', auth, async (req, res) => {
    try {
        // Get cart items from your database
        // Replace this with your actual cart query
        const cartItems = await getCartItemsFromDB(req.userId);
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart is empty' });
        }

        const summary = calculateCartSummary(cartItems);
        res.json({ success: true, summary });
    } catch (error) {
        console.error('Error fetching cart summary:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Helper function to calculate cart totals
const calculateCartSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return {
        items: items.map(item => ({
            id: item.productId,
            name: item.name,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        })),
        subtotal: Math.round(subtotal),
        shipping: shipping,
        tax: Math.round(tax),
        total: Math.round(total)
    };
};

// Replace this with your actual cart data fetching logic
const getCartItemsFromDB = async (userId) => {
    try {
        // This should query your actual cart collection
        // For now, return empty array - you'll implement this based on your cart structure
        return [];
    } catch (error) {
        throw new Error('Failed to fetch cart items');
    }
};

module.exports = router;