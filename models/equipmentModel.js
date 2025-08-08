const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const equipmentSchema = new mongoose.Schema({
  equipmentId: { type: Number },
  equipmentType: { type: String, required: true },
  equipmentModelCode: { type: String, required: true },
  equipmentBrand: { type: String, required: true },
  equipmentMfgYear: { type: Number }
}, {
  timestamps: false,
  versionKey: false
});

equipmentSchema.plugin(AutoIncrement, { inc_field: 'equipmentId' });
equipmentSchema.index({ equipmentId: 1 }, { unique: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
