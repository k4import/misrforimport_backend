const Part = require('../models/partModel.js');

// Create a new part
const createPart = async (req, res) => {
    try {
        const { partNumber, partBrandID, quantity, isKit } = req.body;

        // Check for duplicate partNumber and partBrandID combination
        const existingPart = await Part.findOne({ partNumber, partBrandID });
        if (existingPart) {
            return res.status(400).json({ error: 'partNumber and partBrandID combination already exists.' });
        }

        // Create the part
        const part = new Part({ partNumber, partBrandID, quantity, isKit });
        await part.save();

        res.status(201).json({ message: 'Part created successfully', part });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all parts
const getParts = async (req, res) => {
    try {
        const parts = await Part.find();
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single part by ID
const getPartById = async (req, res) => {
    try {
        const { partID } = req.params;
        const part = await Part.findOne({ partID });
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a part
const updatePart = async (req, res) => {
    try {
        const { partID } = req.params;
        const { partNumber, partBrandID, quantity, isKit } = req.body;

        // Check for duplicate partNumber and partBrandID combination if they are being updated
        const existingPart = await Part.findOne({
            partNumber,
            partBrandID,
            partID: { $ne: partID }, // Exclude the current document
        });

        if (existingPart) {
            return res.status(400).json({
                error: 'Duplicate combination of partNumber and partBrandID.',
            });
        }

        const part = await Part.findOneAndUpdate(
            { partID }, // Query to match the partID
            { partNumber, partBrandID, quantity, isKit }, // Fields to update
            { new: true, runValidators: true } // Options to return the updated document and validate
        );

        if (!part) {
            return res.status(404).json({ message: 'Part not found' });
        }

        res.status(200).json({ message: 'Part updated successfully', part });
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Handle duplicate key error
            if (error.keyPattern?.partNumber && error.keyPattern?.partBrandID) {
                return res.status(400).json({
                    error: 'Duplicate combination of partNumber and partBrandID.',
                });
            }
            if (error.keyPattern?.partID) {
                return res.status(400).json({
                    error: 'Duplicate partID.',
                });
            }
            return res.status(400).json({
                error: 'Update failed due to duplicate data.',
            });
        }

        // Generic error handling
        res.status(400).json({ error: error.message });
    }
};

// Delete a part
const deletePart = async (req, res) => {
    try {
        const { partID } = req.params;
        const part = await Part.findOneAndDelete({ partID });
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.status(200).json({ message: 'Part deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPart,
    getParts,
    getPartById,
    updatePart,
    deletePart,
};
