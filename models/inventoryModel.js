const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const inventorySchema = new mongoose.Schema({
  inventoryID: { type: Number, required: true, unique: true }, // removed index: true
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, default: 0 },
  usdPrice: { type: Number, default: 0 },
  egpPrice: { type: Number, default: 0 },
}, { timestamps: true });

inventorySchema.plugin(AutoIncrement, { inc_field: 'inventoryID', id: 'inventory_counter' });

module.exports = mongoose.model('Inventory', inventorySchema); 