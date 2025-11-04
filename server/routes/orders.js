const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

// Create Razorpay order
router.post('/create-razorpay-order', authMiddleware, async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: orderId,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature is valid, create order in database
      const order = new Order({
        ...orderData,
        user: req.userId,
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        status: 'confirmed'
      });

      await order.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Create new order
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { orderId, shippingAddress, items, totalAmount, paymentMethod, paymentStatus, paymentId, status } = req.body;
        
        const order = new Order({
            user: req.userId,
            orderId,
            shippingAddress,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus,
            paymentId,
            status
        });
        
        await order.save();
        res.json({ success: true, order: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
