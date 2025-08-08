const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Schema for the Product entity
const productSchema = new mongoose.Schema({
    productID: { type: Number }, // Auto-incremented ID
    cardNumber: { type: Number, required: true },
    cardARName: { type: String, required: true },
    cardENName: { type: String, required: true },
    cardCategory: { type: String, required: true },
    cardDimensions: { type: String },
    cardWeight: { type: String },
    cardWeightIsBy: { type: String },
    cardGS1Category: { type: String },
    cardHSCode: { type: String },
    cardEGS1CodeID: { type: String },
    cardNotes: { type: String },
    partNumber: { type: String, required: true },
    partBrand: { type: String, required: true },
    partMinimumQuantity: { type: Number },
    partNumberNotes: { type: String },
    cardIsKit: { type: Boolean, default: false },
    kitComponents: {
        type: [{
            kitQuantityComponent: { type: Number, required: true },
            kitComponentProductID: { type: Number, required: true },
        }],
        default: [],
        required: false
    },
    compatibleEquipment: {
        type: [{
            equipmentId: { type: Number, required: true },
            equipmentType: { type: String, required: true },
            equipmentModelCode: { type: String, required: true },
            equipmentBrand: { type: String, required: true },
            equipmentMfgYear: { type: Number }
        }],
        default: [],
        required: false
    }
}, { timestamps: false,
    __v:false
 });

productSchema.plugin(AutoIncrement, { inc_field: 'productID' });

// Ensure unique indexes
productSchema.index({ productID: 1 }, { unique: true });
productSchema.index({ partNumber: 1, partBrand: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model('Products', productSchema);
