const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // استيراد مكتبة الترقيم التلقائي

// Main schema for card categories
const cardCategorySchema = new mongoose.Schema({
    cardCategoryTitleEN: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate cardCategoryTitleEN
    },
    cardCategoryTitleAR: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate cardCategoryTitleAR
    },
});

// إضافة الترقيم التلقائي لحقل cardCategoryID
cardCategorySchema.plugin(AutoIncrement, { inc_field: 'cardCategoryID' });

// Middleware to handle unique index errors
cardCategorySchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        // Extract the field causing the duplicate error
        const fieldName = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate value for ${fieldName}`));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('CardCategories', cardCategorySchema);
