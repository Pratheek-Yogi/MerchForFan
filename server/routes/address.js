const express = require('express');
const router = express.Router();
const AddressService = require('../services/addressService');
const auth = require('../middleware/authMiddleware');

// Get all addresses for a user
router.get('/', auth, async (req, res) => {
    try {
        const addresses = await AddressService.getAddresses(req.user.id);
        res.json({ success: true, data: addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get addresses', error: error.message });
    }
});

// Add a new address
router.post('/', auth, async (req, res) => {
    try {
        const newAddress = await AddressService.addAddress(req.user.id, req.body);
        res.status(201).json({ success: true, message: 'Address added successfully', data: newAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add address', error: error.message });
    }
});

// Update an address
router.put('/:addressId', auth, async (req, res) => {
    try {
        const updatedAddress = await AddressService.updateAddress(req.user.id, req.params.addressId, req.body);
        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.json({ success: true, message: 'Address updated successfully', data: updatedAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update address', error: error.message });
    }
});

// Delete an address
router.delete('/:addressId', auth, async (req, res) => {
    try {
        const result = await AddressService.deleteAddress(req.user.id, req.params.addressId);
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete address', error: error.message });
    }
});

// Set an address as default
router.patch('/:addressId/default', auth, async (req, res) => {
    try {
        const updatedAddress = await AddressService.setDefaultAddress(req.user.id, req.params.addressId);
        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.json({ success: true, message: 'Default address set successfully', data: updatedAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to set default address', error: error.message });
    }
});

module.exports = router;
