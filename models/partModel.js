const mongoose = require('mongoose');

const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

const partSchema = new mongoose.Schema({
    partID: { type: Number, unique: true }, // Auto-incremented field
    partNumber: { type: String, required: true },
    partBrandID: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isKit: { type: Boolean, required: true },
});

// Add a compound index to prevent duplication of partNumber and partBrandID together
partSchema.index({ partNumber: 1, partBrandID: 1 }, { unique: true });

// Add auto-increment plugin for partID
partSchema.plugin(AutoIncrement, { inc_field: 'partID' });

// Middleware to handle unique index errors and modify the message
partSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern && error.keyPattern.partNumber && error.keyPattern.partBrandID) {
            next(new Error('partNumber and partBrandID combination already exists.'));
        } else if (error.keyPattern && error.keyPattern.partID) {
            next(new Error('partID is already taken.'));
        } else {
            next(new Error('Save failed due to duplicate data.'));
        }
    } else {
        next(error);
    }
});

// Ensure indexes are created in the database if they do not exist
partSchema.indexes();

module.exports = mongoose.model('Part', partSchema);
