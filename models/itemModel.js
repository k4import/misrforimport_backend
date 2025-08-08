const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Main schema for items
const itemSchema = new mongoose.Schema({
    itemID: { type: Number, unique: true }, // Auto-incremented field
    partID: { type: Number, required: true, unique: true }, // Ensure partID is unique
    cardID: { type: Number, required: true },
    itemNameAR: { type: String, required: true, unique: true }, // Ensure itemNameAR is unique
    itemNameEn: { type: String, required: true, unique: true }, // Ensure itemNameEn is unique
    minQty: { type: Number, required: true },
    strategy: { type: Number, default: 0 },
    itemPrice: { type: Number, required: true },
    tGS1CodeID: { type: Number, default: null },
    tHSCodeID: { type: Number, default: null },
    tEGS1CodeID: { type: Number, default: null },
    lengthCM: { type: Number, default: 0 },
    widthCM: { type: Number, default: 0 },
    heightCM: { type: Number, default: 0 },
    outerCm: { type: Number, default: 0 },
    inner: { type: Number, default: 0 },
});

// Add auto-increment plugin for itemID
itemSchema.plugin(AutoIncrement, { inc_field: 'itemID' });

// Middleware to ensure no duplicate values for partID, itemNameAR, and itemNameEn
itemSchema.pre('save', async function (next) {
    try {
        const existingItem = await mongoose.models['Items'].findOne({
            $or: [
                { partID: this.partID },
                { itemNameAR: this.itemNameAR },
                { itemNameEn: this.itemNameEn },
            ],
        });

        if (existingItem) {
            const errorMessage =
                existingItem.partID === this.partID
                    ? 'Duplicate partID'
                    : existingItem.itemNameAR === this.itemNameAR
                    ? 'Duplicate itemNameAR'
                    : 'Duplicate itemNameEn';
            return next(new Error(errorMessage));
        }

        next(); // Proceed if no duplicates are found
    } catch (error) {
        next(error);
    }
});

// Middleware to handle unique index errors
itemSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const fieldName = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate value for ${fieldName}`));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Items', itemSchema);
