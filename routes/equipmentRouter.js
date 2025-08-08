const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController.js');

// Create a new equipment
router.post('/AddNewEquipment', equipmentController.createEquipment);

// Get all equipment
router.get('/GetAllEquipment', equipmentController.getEquipment);

// Get equipment by ID
router.get('/GetEquipmentByID/:equipmentId', equipmentController.getEquipmentById);

// Update equipment
router.put('/UpdateEquipmentByID/:equipmentId', equipmentController.updateEquipment);

// Delete equipment
router.delete('/DeleteEquipmentByID/:equipmentId', equipmentController.deleteEquipment);

module.exports = router; 