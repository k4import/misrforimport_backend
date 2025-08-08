const express = require('express');
const router = express.Router();
const itemController = require ("../controllers/itemController.js")

// Define routes and map them to the controller
router.post('/AddNewItem', itemController.addNewItem);              // Add a new item
router.get('/GetAllItems', itemController.getAllItems);                 // Get all items
router.get('/GetItemByID/:itemID', itemController.getItemById);             // Get a single item by ID
router.put('/UpdateItemByID/:itemID', itemController.updateItemById);          // Update a item by ID
router.delete('/DeleteItemByID/:itemID', itemController.deleteItemById);       // Delete a item by ID

module.exports = router;
