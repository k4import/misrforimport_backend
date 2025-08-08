const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getAllInventory);
router.post('/', inventoryController.createInventory);
router.put('/:inventoryID', inventoryController.updateInventory);
router.delete('/:inventoryID', inventoryController.deleteInventory);

// Advanced bulk actions
router.post('/bulk-delete', inventoryController.bulkDeleteInventory);
router.post('/bulk-update', inventoryController.bulkUpdateInventory);



module.exports = router; 