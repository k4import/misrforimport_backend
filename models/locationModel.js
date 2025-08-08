const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const locationSchema = new mongoose.Schema({
  locationID: { type: Number, required: true, unique: true }, // removed index: true
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

locationSchema.plugin(AutoIncrement, { inc_field: 'locationID', id: 'location_counter' });

module.exports = mongoose.model('Location', locationSchema); 