const Item = require('../models/itemModel.js');

// Add a new item
const addNewItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json({ message: 'Item added successfully', item });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a item by ID
const getItemById = async (req, res) => {
    try {
        const { itemID } = req.params
        const item = await Item.findOne({ itemID });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a item by ID
// Update an item by ID
// Update an item by ID
const updateItemById = async (req, res) => {
    try {
        const { itemID } = req.params;
        const { partID, itemNameAR, itemNameEn } = req.body;

        // Check for duplicates before updating
        const duplicateItem = await Item.findOne({
            $or: [
                { itemID: { $ne: itemID }, partID },
                { itemID: { $ne: itemID }, itemNameAR },
                { itemID: { $ne: itemID }, itemNameEn }
            ]
        });

        if (duplicateItem) {
            let duplicateFields = [];

            if (duplicateItem.partID === partID) {
                duplicateFields.push("partID");
            }
            if (duplicateItem.itemNameAR === itemNameAR) {
                duplicateFields.push("itemNameAR");
            }
            if (duplicateItem.itemNameEn === itemNameEn) {
                duplicateFields.push("itemNameEn");
            }

            return res.status(400).json({
                error: `Duplicate detected in the following fields: ${duplicateFields.join(", ")}`,
                duplicateFields
            });
        }

        // Proceed with the update
        const updatedItem = await Item.findOneAndUpdate(
            { itemID },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully', updatedItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



// Delete a item by ID
const deleteItemById = async (req, res) => {
    try {

        const { itemID } = req.params;
        const deletedItem = await Item.findOneAndDelete({ itemID });
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addNewItem,
    getAllItems,
    getItemById,
    updateItemById,
    deleteItemById
}