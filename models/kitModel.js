const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Sub-schema for kit components
const kitComponentSchema = new mongoose.Schema(
    {
        itemID: { type: Number, required: true },
        QTY_of_Componente: { type: Number, required: true },
    },
    { _id: false } // Disable _id for sub-documents
);

// Main schema for kits
const kitSchema = new mongoose.Schema({
    kitID: { type: Number, unique: true }, // Auto-incremented field
    partID: { type: Number, required: true, unique: true },
    cardID: { type: Number, required: true },
    kitNameAR: { type: String, required: true, unique: true },
    kitNameEn: { type: String, required: true, unique: true },
    minQty: { type: Number, required: true },
    strategy: { type: Number, default: 0 },
    kitPrice: { type: Number, required: true },
    tGS1CodeID: { type: Number, default: null },
    tHSCodeID: { type: Number, default: null },
    tEGS1CodeID: { type: Number, default: null },
    lengthCM: { type: Number, default: 0 },
    widthCM: { type: Number, default: 0 },
    heightCM: { type: Number, default: 0 },
    outerCm: { type: Number, default: 0 },
    inner: { type: Number, default: 0 },
    kitComponentes: {
        type: [kitComponentSchema],
        validate: {
            validator: function (components) {
                const itemIDs = components.map((c) => c.itemID);
                return itemIDs.length === new Set(itemIDs).size; // Ensure no duplicate itemIDs
            },
            message: 'kitComponentes contains duplicate itemIDs.',
        },
    },
});

// Add auto-increment plugin for kitID
kitSchema.plugin(AutoIncrement, { inc_field: 'kitID' });

// Middleware to ensure no duplicate partID, kitNameAR, or kitNameEn
kitSchema.pre('save', async function (next) {
    try {
        const existingKit = await mongoose.models['Kits'].findOne({
            $or: [
                { partID: this.partID },
                { kitNameAR: this.kitNameAR },
                { kitNameEn: this.kitNameEn },
                { kitComponentes: this.kitComponentes }
            ],
        });

        if (existingKit) {
            const errorMessage =
                existingKit.partID === this.partID
                    ? 'Duplicate partID'
                    : existingKit.kitNameAR === this.kitNameAR
                        ? 'Duplicate kitNameAR'
                        : existingKit.kitComponentes && JSON.stringify(existingKit.kitComponentes) === JSON.stringify(this.kitComponentes)
                            ? 'Duplicate kitComponentes'
                            : existingKit.kitNameEn === this.kitNameEn
                                ? 'Duplicate kitNameEn'
                                : '';

            return next(new Error(errorMessage));
        }

        next(); // Proceed if no duplicates are found
    } catch (error) {
        next(error);
    }
});

// Middleware to handle unique index errors
kitSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const fieldName = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate value for ${fieldName}`));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Kits', kitSchema);
