const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import auto-increment plugin

// Schema for the Card entity
const cardSchema = new mongoose.Schema({
    cardTitleAr: { type: String, required: true }, // Arabic title
    cardTitleEN: { type: String, required: true }, // English title
    categoryID: { type: Number, required: true } // Reference to the category
});

// Apply the auto-increment plugin to `cardID` and `cardNumber`
cardSchema.plugin(AutoIncrement, { inc_field: 'cardID' }); // Auto-increment cardID
cardSchema.plugin(AutoIncrement, { inc_field: 'cardNumber' }); // Auto-increment cardNumber

// Middleware to handle duplicate key errors and provide detailed responses
cardSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        let errorMessage = 'Duplicate value detected: ';
        const errors = [];

        if (error.keyPattern.cardTitleAr) {
            errors.push(`cardTitleA`);
        }

        if (error.keyPattern.cardTitleEN) {
            errors.push(`cardTitleEN`);
        }

        errorMessage += errors.join(' ');
        // Pass a custom error message to the next middleware
        next(new Error(errorMessage));
    } else {
        next(error); // Proceed for other errors
    }
});

// Ensure indexes are created in the database
cardSchema.index({ cardTitleAr: 1 }, { unique: true }); // Ensure unique cardTitleAr
cardSchema.index({ cardTitleEN: 1 }, { unique: true }); // Ensure unique cardTitleEN

module.exports = mongoose.model('Cards', cardSchema);
