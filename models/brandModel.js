const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const brandSchema = new mongoose.Schema({
    brandID: { type: Number },
    brandName: { type: String, required: true },
});

brandSchema.pre('save', async function (next) {
    try {
        // Convert brand name to uppercase
        if (this.brandName) {
            this.brandName = this.brandName.toUpperCase();
        }
        
        // Only check for duplicate brandName since brandID is auto-generated
        const existingBrand = await mongoose.models['Brands'].findOne({
            brandName: this.brandName
        });
        if (existingBrand) {
            return next(new Error('brandName already exists'));
        }
        next();
    } catch (error) {
        next(error);
    }
});

brandSchema.plugin(AutoIncrement, { inc_field: 'brandID' });
brandSchema.index({ brandID: 1 }, { unique: true });
brandSchema.index({ brandName: 1 }, { unique: true });

module.exports = mongoose.model('Brands', brandSchema); 