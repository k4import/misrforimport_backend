const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController.js');

// Create a new vendor
router.post('/AddNewVendor', vendorController.createVendor);

// Get all vendors
router.get('/GetAllVendors', vendorController.getVendors);

// Get a vendor by ID
router.get('/GetVendorByID/:vendorID', vendorController.getVendorById);

// Update a vendor
router.put('/UpdateVendorByID/:vendorID', vendorController.updateVendor);

// Delete a vendor
router.delete('/DeleteVendorByID/:vendorID', vendorController.deleteVendor);

module.exports = router;