const Warehouse = require('../models/warehouseModel');

exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createWarehouse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const warehouse = new Warehouse({ name, description });
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateWarehouse = async (req, res) => {
  try {
    const { warehouseID } = req.params;
    const { name, description } = req.body;
    const warehouse = await Warehouse.findOneAndUpdate(
      { warehouseID: Number(warehouseID) },
      { name, description },
      { new: true }
    );
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    res.json(warehouse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWarehouse = async (req, res) => {
  try {
    const { warehouseID } = req.params;
    const warehouse = await Warehouse.findOneAndDelete({ warehouseID: Number(warehouseID) });
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    res.json({ message: 'Warehouse deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 