const Inventory = require('../models/inventoryModel');
const Product = require('../models/productsModel');
const Warehouse = require('../models/warehouseModel');
const Location = require('../models/locationModel');

// Advanced GET: filtering, sorting, pagination
const getAllInventory = async (req, res) => {
  try {
    const {
      productID,
      warehouseID,
      locationID,
      minQTY,
      maxQTY,
      minUSD,
      maxUSD,
      minEGP,
      maxEGP,
      sortBy = 'inventoryID',
      sortOrder = 'asc',
      page = 1,
      pageSize = 50,
    } = req.query;

    const filter = {};
    if (productID) filter.product = productID;
    if (warehouseID) filter.warehouse = warehouseID;
    if (locationID) filter.location = locationID;
    if (minQTY) filter.quantity = { ...filter.quantity, $gte: Number(minQTY) };
    if (maxQTY) filter.quantity = { ...filter.quantity, $lte: Number(maxQTY) };
    if (minUSD) filter.usdPrice = { ...filter.usdPrice, $gte: Number(minUSD) };
    if (maxUSD) filter.usdPrice = { ...filter.usdPrice, $lte: Number(maxUSD) };
    if (minEGP) filter.egpPrice = { ...filter.egpPrice, $gte: Number(minEGP) };
    if (maxEGP) filter.egpPrice = { ...filter.egpPrice, $lte: Number(maxEGP) };

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const total = await Inventory.countDocuments(filter);
    const inventory = await Inventory.find(filter)
      .populate('product warehouse location')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({ total, data: inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk delete
const bulkDeleteInventory = async (req, res) => {
  try {
    const { inventoryIDs } = req.body;
    if (!Array.isArray(inventoryIDs) || inventoryIDs.length === 0) {
      return res.status(400).json({ error: 'No inventoryIDs provided' });
    }
    await Inventory.deleteMany({ inventoryID: { $in: inventoryIDs } });
    res.json({ message: 'Bulk delete successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk update (e.g., price adjustment)
const bulkUpdateInventory = async (req, res) => {
  try {
    const { inventoryIDs, updateData } = req.body;
    if (!Array.isArray(inventoryIDs) || inventoryIDs.length === 0) {
      return res.status(400).json({ error: 'No inventoryIDs provided' });
    }
    await Inventory.updateMany(
      { inventoryID: { $in: inventoryIDs } },
      { $set: updateData }
    );
    res.json({ message: 'Bulk update successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Basic audit log (append to a file)
function logAudit(action, details) {
  const logLine = `${new Date().toISOString()} | ${action} | ${JSON.stringify(details)}\n`;
  fs.appendFile('inventory_audit.log', logLine, () => {});
}
// Call logAudit in create/update/delete/bulk endpoints as needed 

module.exports = {
  getAllInventory,
  createInventory: async (req, res) => { /* ...existing logic... */ },
  updateInventory: async (req, res) => { /* ...existing logic... */ },
  deleteInventory: async (req, res) => { /* ...existing logic... */ },
  bulkDeleteInventory,
  bulkUpdateInventory,
}; 