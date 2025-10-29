const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData'); // Your existing UserData model

// Middleware to get user from token (you might already have this)
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Verify token and get user ID (implement your JWT verification logic)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Get user data with addresses
router.get('/data', auth, async (req, res) => {
    try {
        const user = await UserData.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add/update user address
router.post('/address', auth, async (req, res) => {
    try {
        const { addressline1, addressline2, addressType = 'primary' } = req.body;
        
        const updateData = {};
        if (addressType === 'primary') {
            updateData.addressline1 = addressline1;
        } else {
            updateData.addressline2 = addressline1;
        }

        const user = await UserData.findOneAndUpdate(
            { _id: req.userId },
            { $set: updateData },
            { new: true }
        );
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;