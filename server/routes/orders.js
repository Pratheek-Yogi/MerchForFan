const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// Get user orders
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate('items.product')
            .sort({ date: -1 });
        
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create new order
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { orderId, shippingAddress, items, totalAmount, paymentStatus, status } = req.body;
        
        const order = new Order({
            user: req.userId,
            orderId,
            shippingAddress,
            items,
            totalAmount,
            paymentStatus,
            status
        });
        
        await order.save();
        res.json({ success: true, orderId: order._id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;