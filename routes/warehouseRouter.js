const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

router.get('/', warehouseController.getAllWarehouses);
router.post('/', warehouseController.createWarehouse);
router.put('/:warehouseID', warehouseController.updateWarehouse);
router.delete('/:warehouseID', warehouseController.deleteWarehouse);

module.exports = router; 