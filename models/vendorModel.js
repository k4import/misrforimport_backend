const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Schema for the Vendor entity
const vendorSchema = new mongoose.Schema({
  vendorID: { type: Number }, // Auto-incremented ID
  vendorName: { type: String, required: true },
  vendorMainPhone: { type: String, required: true },
  vendorMainEMail: { type: String, required: true },
  vendorContactPerson: { type: String, default: "" },
  vendorCountry: { type: String, required: true },
  vendorType: { type: String, required: true },
  vendorTax: { type: String,  },
  // You can add more fields as needed
}, { 
  timestamps: false,
  __v: false
});

// Plugin for auto-incrementing vendorID
vendorSchema.plugin(AutoIncrement, { inc_field: 'vendorID' });

// Ensure unique indexes
vendorSchema.index({ vendorID: 1  }, { unique: true });

// You might want to make vendorName unique or add other indexes
// vendorSchema.index({ vendorName: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model('Vendors', vendorSchema);