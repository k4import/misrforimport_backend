const PartBrand = require('../models/partBrandModel.js');

// Create a new part brand
const createPartBrand = async (req, res) => {
    try {
        let { partBrandID, partBrandName } = req.body;

        // If partBrandID is provided, we will check if it exists; if not, we start with 1
        if (!partBrandID) {
            partBrandID = 1; // You can change this to any initial value you prefer
        }

        // Check if the partBrandID already exists
        let partBrandExists = await PartBrand.findOne({ partBrandID: partBrandID });

        // Keep incrementing partBrandID until a unique one is found
        while (partBrandExists) {
            partBrandID++;
            partBrandExists = await PartBrand.findOne({ partBrandID: partBrandID });
        }

        // Now, create a new part brand with the unique partBrandID
        const partBrand = new PartBrand({ partBrandID, partBrandName });

        // Save the new part brand
        await partBrand.save();

        // Respond with success message and the created partBrand
        res.status(201).json({ message: 'Part brand created successfully', partBrand });
    } catch (error) {
        // Handle errors and send error response
        res.status(400).json({ error: error.message });
    }
};


// Get all part brands
const getPartBrands = async (req, res) => {
    try {
        const partBrands = await PartBrand.find();
        res.status(200).json(partBrands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single part brand by ID
const getPartBrandById = async (req, res) => {

    try {
        let partBrandID = req.params.partBrandID
        const partBrand = await PartBrand.find({ partBrandID });
        if (partBrand.length == 0) return res.status(404).json({ message: 'Part brand not found' });
        if (!partBrand) return res.status(404).json({ message: 'Part brand not found' });
        res.status(200).json(partBrand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a part brand
const updatePartBrand = async (req, res) => {
    try {
        const partBrandID = req.params.partBrandID;
        const { partBrandName } = req.body;

        console.log("Received partBrandID:", partBrandID); // Debugging
        console.log("Request body:", req.body); // Debugging

        // Check for duplicates
        const duplicate = await PartBrand.findOne({
            partBrandName: partBrandName,
            partBrandID: { $ne: partBrandID } // Ensure it's not the same document
        });

        if (duplicate) {
            return res.status(400).json({ message: "Duplicate part brand name exists" });
        }

        // Perform update
        const partBrand = await PartBrand.findOneAndUpdate(
            { partBrandID: partBrandID },
            { $set: { partBrandName: partBrandName } },
            { new: true } // Return updated document
        );

        if (!partBrand) {
            console.log("Part brand not found for ID:", partBrandID); // Debugging
            return res.status(404).json({ message: "Part brand not found" });
        }

        res.status(200).json({ message: "Part brand updated successfully", partBrand });
    } catch (error) {
        console.error("Error updating part brand:", error); // Debugging
        res.status(400).json({ error: error.message });
    }
};



// Delete a part brand by part brand id
const deletePartBrand = async (req, res) => {
    try {
        // Extract partBrandID from the request parameters
        const { partBrandID } = req.params;

        // Attempt to find and delete the part brand using partBrandID
        const partBrand = await PartBrand.findOneAndDelete({ partBrandID });

        if (!partBrand) {
            // Return 404 if no part brand was found
            return res.status(404).json({ message: 'Part brand not found' });
        }

        // Return a success message if deletion was successful
        res.status(200).json({ message: 'Part brand deleted successfully' });
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createPartBrand,
    getPartBrands,
    getPartBrandById,
    updatePartBrand,
    deletePartBrand
};
