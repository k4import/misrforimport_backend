const Vendor = require('../models/vendorModel.js');

// Create a new vendor
const createVendor = async (req, res) => {
    try {
        let {
            vendorName,
            vendorMainPhone,
            vendorMainEMail,
            vendorContactPerson,
            vendorCountry,
            vendorType,
            vendorTax
        } = req.body;

        // Check for existing vendor
        const existingVendor = await Vendor.findOne({
            $or: [
                { vendorName },
                { vendorMainEMail },
                { vendorMainPhone },
            ]
        }).select({ _id: 0, __v: 0 });

        if (existingVendor) {
            let conflictField = '';
            if (existingVendor.vendorName === vendorName) conflictField = 'vendorName';
            else if (existingVendor.vendorMainEMail === vendorMainEMail) conflictField = 'vendorMainEMail';
            else if (existingVendor.vendorMainPhone === vendorMainPhone) conflictField = 'vendorMainPhone';

            return res.status(409).json({
                status: false,
                error: `Conflict: Vendor with ${conflictField} "${req.body[conflictField]}" already exists`
            });
        }

        // Create and save new vendor
        const vendor = new Vendor({
            vendorName,
            vendorMainPhone,
            vendorMainEMail,
            vendorContactPerson,
            vendorCountry,
            vendorType,
            vendorTax
        });

        await vendor.save();

        // Convert to plain object and transform response
        const responseVendor = vendor.toObject();
        delete responseVendor._id;
        delete responseVendor.__v;

        res.status(201).json({
            status: true,
            message: 'Vendor created successfully',
            vendor: responseVendor
        });

    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createVendor (vendorController)"
        });
    }
};

// Get all vendors
const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find()
            .select({ _id: 0, __v: 0 })
            .sort({ vendorID: 1 });

        res.status(200).json({
            status: true,
            count: vendors.length,
            data: vendors
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getVendors (vendorController)"
        });
    }
};

// Get vendor by ID
const getVendorById = async (req, res) => {
    try {
        const { vendorID } = req.params;
        const vendor = await Vendor.findOne({ vendorID })
            .select({ _id: 0, __v: 0 });

        if (!vendor) {
            return res.status(404).json({
                status: false,
                error: 'Vendor not found'
            });
        }

        res.status(200).json({
            status: true,
            data: vendor
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getVendorById (vendorController)"
        });
    }
};

// Update vendor
const updateVendor = async (req, res) => {
    try {
        const { vendorID } = req.params;
        const updateFields = req.body;

        const updatedVendor = await Vendor.findOneAndUpdate(
            { vendorID },
            updateFields,
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedVendor) {
            return res.status(404).json({
                status: false,
                error: 'Vendor not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Vendor updated successfully',
            data: updatedVendor
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateVendor (vendorController)"
        });
    }
};

// Delete vendor
const deleteVendor = async (req, res) => {
    try {
        const { vendorID } = req.params;
        const deletedVendor = await Vendor.findOneAndDelete({ vendorID });

        if (!deletedVendor) {
            return res.status(404).json({
                status: false,
                error: 'Vendor not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Vendor deleted successfully',
            deletedID: vendorID
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteVendor (vendorController)"
        });
    }
};

module.exports = {
    createVendor,
    getVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};