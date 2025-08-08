const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController.js');

// Create a new client
router.post('/AddNewClient', clientController.createClient);

// Get all clients
router.get('/GetAllClients', clientController.getClients);

// Get a client by ID
router.get('/GetClientByID/:clientID', clientController.getClientById);

// Update a client
router.put('/UpdateClientByID/:clientID', clientController.updateClient);

// Delete a client
router.delete('/DeleteClientByID/:clientID', clientController.deleteClient);

module.exports = router; 