const express = require('express');
const router = express.Router();
const kitController = require ("../controllers/kitController.js")

// Define routes and map them to the controller
router.post('/AddNewKit', kitController.addKit);              // Add a new kit
router.get('/GetAllKits', kitController.getAllKits);                 // Get all kits
router.get('/GetKitByID/:kitID', kitController.getKitById);             // Get a single kit by ID
router.put('/UpdateKitByID/:kitID', kitController.updateKitById);          // Update a kit by ID
router.delete('/DeleteKitByID/:kitID', kitController.deleteKitById);       // Delete a kit by ID

// Stream Data
router.get('/GetAllKitsStream', kitController.getAllKitsStream);     // Get all kits as Stream

module.exports = router;
