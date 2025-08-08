const express = require('express');
const router = express.Router();
const partBrandController = require('../controllers/partBrandController');

// Create a new part brand
router.post('/AddNewPartBrand', partBrandController.createPartBrand);

// Get all part brands
router.get('/GetAllPartBrands', partBrandController.getPartBrands);

// Get a single part brand by ID
router.get('/GetPartBrandByID/:partBrandID', partBrandController.getPartBrandById);

// Update a part brand
router.put('/UpdatePartBrandByID/:partBrandID', partBrandController.updatePartBrand);

// Delete a part brand
router.delete('/DeletePartBrandByID/:partBrandID', partBrandController.deletePartBrand);

module.exports = router;
