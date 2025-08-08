const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const warehouseSchema = new mongoose.Schema({
  warehouseID: { type: Number, required: true, unique: true }, // removed index: true
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

warehouseSchema.plugin(AutoIncrement, { inc_field: 'warehouseID', id: 'warehouse_counter' });

module.exports = mongoose.model('Warehouse', warehouseSchema); 