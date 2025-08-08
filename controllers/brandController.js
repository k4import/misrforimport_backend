const Brand = require('../models/brandModel.js');

// Create a new brand
const createBrand = async (req, res) => {
    try {
        const { brandName } = req.body;

        // Check for existing brand by name
        const existingBrand = await Brand.findOne({
            brandName
        }).select({ _id: 0, __v: 0 });

        if (existingBrand) {
            return res.status(409).json({
                status: false,
                error: `Conflict: Brand with name "${brandName}" already exists`
            });
        }

        // Create and save new brand
        const brand = new Brand({
            brandName
        });

        await brand.save();

        const responseBrand = brand.toObject();
        delete responseBrand._id;
        delete responseBrand.__v;

        res.status(201).json({
            status: true,
            message: 'Brand created successfully',
            brand: responseBrand
        });
    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createBrand (brandController)"
        });
    }
};

// Get all brands
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
            .select({ _id: 0, __v: 0 })
            .sort({ brandID: 1 });

        res.status(200).json({
            status: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getBrands (brandController)"
        });
    }
};

// Get brand by ID
const getBrandById = async (req, res) => {
    try {
        const { brandID } = req.params;
        const brand = await Brand.findOne({ brandID })
            .select({ _id: 0, __v: 0 });

        if (!brand) {
            return res.status(404).json({
                status: false,
                error: 'Brand not found'
            });
        }

        res.status(200).json({
            status: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getBrandById (brandController)"
        });
    }
};

// Update brand
const updateBrand = async (req, res) => {
    try {
        const { brandID } = req.params;
        const updateFields = req.body;

        const updatedBrand = await Brand.findOneAndUpdate(
            { brandID },
            updateFields,
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedBrand) {
            return res.status(404).json({
                status: false,
                error: 'Brand not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Brand updated successfully',
            data: updatedBrand
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateBrand (brandController)"
        });
    }
};

// Delete brand
const deleteBrand = async (req, res) => {
    try {
        const { brandID } = req.params;
        const deletedBrand = await Brand.findOneAndDelete({ brandID });

        if (!deletedBrand) {
            return res.status(404).json({
                status: false,
                error: 'Brand not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Brand deleted successfully',
            deletedID: brandID
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteBrand (brandController)"
        });
    }
};

module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
}; 