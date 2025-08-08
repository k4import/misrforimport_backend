const Location = require('../models/locationModel');

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;
    const location = new Location({ name, description });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { locationID } = req.params;
    const { name, description } = req.body;
    const location = await Location.findOneAndUpdate(
      { locationID: Number(locationID) },
      { name, description },
      { new: true }
    );
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { locationID } = req.params;
    const location = await Location.findOneAndDelete({ locationID: Number(locationID) });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 