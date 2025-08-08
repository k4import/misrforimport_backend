const CardCategory = require('../models/cardCategoriesModel.js');

// Create a new cardCategory
// Create a new cardCategory
const addNewCardCategory = async (req, res) => {
    try {
        const { cardCategoryTitleEN, cardCategoryTitleAR } = req.body;

        // Create a new card category (ID is auto-generated)
        const cardCategory = new CardCategory({ cardCategoryTitleEN, cardCategoryTitleAR });

        // Save the new entity
        await cardCategory.save();

        // Format the response to exclude __v and _id
        const response = {
            cardCategoryTitleEN: cardCategory.cardCategoryTitleEN,
            cardCategoryTitleAR: cardCategory.cardCategoryTitleAR,
            cardCategoryID: cardCategory.cardCategoryID,
        };

        // Success response
        res.status(201).json({ message: 'Category created successfully', cardCategory: response });
    } catch (error) {
        // Error response
        res.status(400).json({ error: error.message });
    }
};



// Get all categories
const getAllCardCategories = async (req, res) => {
    try {
        const categories = await CardCategory.find().select({_id:0 ,__v:0 }).sort({cardCategoryID:1}); // Sort categories if needed

        let categoriesData = {
            "status": true,
            "categoriesData": categories
        }

        // If no categories found, return an empty list
        if (!categories) {
            categoriesData = {
                "status": true,
                "categoriesData": []
            };
            return res.status(404).send(categoriesData);
        } else {
            return res.status(200).send(categoriesData);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a single cardCategory by ID
const getCardCategoryById = async (req, res) => {
    try {
        const { cardCategoryID } = req.params;
        const cardCategory = await CardCategory.findOne({ cardCategoryID });
        if (!cardCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(cardCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Update a cardCategory
const updateCardCategory = async (req, res) => {
    try {
        const { cardCategoryID, cardCategoryTitleEN, cardCategoryTitleAR } = req.body;

        const updatedCardCategory = await CardCategory.findOneAndUpdate(
            { cardCategoryID: req.params.cardCategoryID },
            { cardCategoryID, cardCategoryTitleEN, cardCategoryTitleAR },
            { new: true, runValidators: true } // Important: Enable validators
        );

        if (!updatedCardCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', cardCategory: updatedCardCategory });
    } catch (error) {
        if (error.code === 11000) {
            // Determine which field caused the duplicate key error
            let duplicateField = "";
            if (error.keyPattern && error.keyPattern.cardCategoryTitleEN === 1) {
                duplicateField = "Title (English)";
            } else if (error.keyPattern && error.keyPattern.cardCategoryTitleAR === 1) {
                duplicateField = "Title (Arabic)";
            } else if (error.keyPattern && error.keyPattern.cardCategoryID === 1) {
                duplicateField = "ID";
            }
            return res.status(400).json({
                message: `Category update failed. Duplicate ${duplicateField} "${req.body[Object.keys(error.keyPattern)[0]]}" already exists.`
            });
        } else if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation errors occurred:', errors: validationErrors });
        } else {
            console.error('Error updating card category:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// Delete a cardCategory
const deleteCardCategory = async (req, res) => {
    try {
        const cardCategory = await CardCategory.findOneAndDelete({ cardCategoryID: req.params.cardCategoryID });
        if (!cardCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addNewCardCategory,
    getAllCardCategories,
    getCardCategoryById,
    updateCardCategory,
    deleteCardCategory
};
