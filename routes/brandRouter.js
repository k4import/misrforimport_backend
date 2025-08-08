const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// Create a new brand
router.post('/AddNewBrand', brandController.createBrand);

// Get all brands
router.get('/GetAllBrands', brandController.getBrands);

// Get a single brand by ID
router.get('/GetBrandByID/:brandID', brandController.getBrandById);

// Update a brand
router.put('/UpdateBrandByID/:brandID', brandController.updateBrand);

// Delete a brand
router.delete('/DeleteBrandByID/:brandID', brandController.deleteBrand);

module.exports = router; 