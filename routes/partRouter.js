const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController.js');

// Create a new part
router.post('/AddNewPart', partController.createPart);

// Get all parts
router.get('/GetAllParts', partController.getParts);

// Get a single part by ID
router.get('/GetPartByID/:partID', partController.getPartById);

// Update a part
router.put('/UpdatePartByID/:partID', partController.updatePart);

// Delete a part
router.delete('/DeletePartByID/:partID', partController.deletePart);

module.exports = router;
