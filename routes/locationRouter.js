const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createLocation);
router.put('/:locationID', locationController.updateLocation);
router.delete('/:locationID', locationController.deleteLocation);

module.exports = router; 