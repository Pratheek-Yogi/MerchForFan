const express = require('express');
const router = express.Router();
const ProfileService = require('../services/profileServices');
const auth = require('../middleware/authMiddleware');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const userProfile = await ProfileService.getProfile(req.user.id);
        res.json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            gender,
            avatar,
            emailNotifications,
            smsNotifications
        } = req.body;

        // Validate email if provided
        if (email) {
            const emailExists = await ProfileService.isEmailExists(email, req.user.id);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use by another account'
                });
            }
        }

        const updateData = {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            gender,
            avatar,
            emailNotifications,
            smsNotifications
        };

        const updatedProfile = await ProfileService.updateProfile(req.user.id, updateData);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Update only preferences
router.patch('/profile/preferences', auth, async (req, res) => {
    try {
        const { emailNotifications, smsNotifications } = req.body;

        const preferences = {
            emailNotifications,
            smsNotifications
        };

        const updatedProfile = await ProfileService.updatePreferences(req.user.id, preferences);

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences',
            error: error.message
        });
    }
});

// Update avatar only
router.patch('/profile/avatar', auth, async (req, res) => {
    try {
        const { avatar } = req.body;

        if (!avatar) {
            return res.status(400).json({
                success: false,
                message: 'Avatar URL is required'
            });
        }

        const updatedProfile = await ProfileService.updateAvatar(req.user.id, avatar);

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update avatar',
            error: error.message
        });
    }
});

module.exports = router;
