const { de } = require('date-fns/locale');
const ForeignCurrencyPurchaseInvoice = require('../models/foreignCurrencyPurchaseInvoiceModel');

// Create a new purchase invoice
const createForeignCurrencyPurchaseInvoice = async (req, res) => {
    try {
        const invoice = new ForeignCurrencyPurchaseInvoice(req.body);
        await invoice.save();

        // Convert to plain object and transform response
        const responseInvoice = invoice.toObject();
        delete responseInvoice._id;
        delete responseInvoice.__v;

        res.status(201).json({
            status: true,
            message: 'Purchase invoice created successfully',
            invoice: responseInvoice
        });

    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createForeignCurrencyPurchaseInvoice (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Add item to an existing purchase invoice
const addItemToForeignCurrencyPurchaseInvoice = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId } = req.params;
        const newItem = req.body;

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            { foreignCurrencyPurchaseInvoiceId },
            { $push: { foreignCurrencyPurchaseInvoiceItems: newItem } },
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Item added to purchase invoice successfully',
            invoice: updatedInvoice
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "addItemToForeignCurrencyPurchaseInvoice (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Get all purchase invoices
const getAllForeignCurrencyPurchaseInvoices = async (req, res) => {
    try {
        const invoices = await ForeignCurrencyPurchaseInvoice.find()
            .select({ _id: 0, __v: 0 })
            .sort({ foreignCurrencyPurchaseInvoiceNumber: 1 });

        res.status(200).json({
            status: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getAllForeignCurrencyPurchaseInvoices (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Get purchase invoice by ID
const getForeignCurrencyPurchaseInvoiceById = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId } = req.params;
        const invoice = await ForeignCurrencyPurchaseInvoice.findOne({ foreignCurrencyPurchaseInvoiceId })
            .select({ _id: 0, __v: 0 });

        if (!invoice) {
            return res.status(404).json({
                status: false,
                error: 'Foreign currency purchase invoice not found'
            });
        }

        res.status(200).json({
            status: true,
            data: invoice
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getForeignCurrencyPurchaseInvoiceById (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Get purchase invoices by vendor
const getForeignCurrencyPurchaseInvoicesByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const invoices = await ForeignCurrencyPurchaseInvoice.find({ 'vendor.vendorId': vendorId })
            .select({ _id: 0, __v: 0 })
            .sort({ foreignCurrencyPurchaseInvoiceId: 1 });

        res.status(200).json({
            status: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getForeignCurrencyPurchaseInvoicesByVendor (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Get purchase invoices by status
const getForeignCurrencyPurchaseInvoicesByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const invoices = await ForeignCurrencyPurchaseInvoice.find({ foreignCurrencyPurchaseInvoiceStatus: status })
            .select({ _id: 0, __v: 0 })
            .sort({ foreignCurrencyPurchaseInvoiceId: 1 });

        res.status(200).json({
            status: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getForeignCurrencyPurchaseInvoicesByStatus (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Get purchase invoices by date range
const getForeignCurrencyPurchaseInvoicesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                status: false,
                error: 'Both startDate and endDate query parameters are required'
            });
        }

        const invoices = await ForeignCurrencyPurchaseInvoice.find({
            'foreignCurrencyPurchaseInvoiceDates.foreignCurrencyPurchaseInvoiceOrderedDate': {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
            .select({ _id: 0, __v: 0 })
            .sort({ 'foreignCurrencyPurchaseInvoiceDates.foreignCurrencyPurchaseInvoiceOrderedDate': 1 });

        res.status(200).json({
            status: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getForeignCurrencyPurchaseInvoicesByDateRange (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Update purchase invoice
const updateForeignCurrencyPurchaseInvoice = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId } = req.params;
        const updateFields = req.body;

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            { foreignCurrencyPurchaseInvoiceId },
            updateFields,
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice updated successfully',
            data: updatedInvoice
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateForeignCurrencyPurchaseInvoice (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Update purchase invoice status
const updateForeignCurrencyPurchaseInvoiceStatus = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId } = req.params;
        const { foreignCurrencyPurchaseInvoiceStatus } = req.body;

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            { foreignCurrencyPurchaseInvoiceId },
            { foreignCurrencyPurchaseInvoiceStatus },
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice status updated successfully',
            data: updatedInvoice
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateForeignCurrencyPurchaseInvoiceStatus (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Update purchase invoice item
const updateForeignCurrencyPurchaseInvoiceItem = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId, productId } = req.params;
        const updateFields = req.body;

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            {
                foreignCurrencyPurchaseInvoiceId,
                'foreignCurrencyPurchaseInvoiceItems.productId': parseInt(productId)
            },
            {
                $set: {
                    'foreignCurrencyPurchaseInvoiceItems.$': updateFields
                }
            },
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice or item not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice item updated successfully',
            data: updatedInvoice
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateForeignCurrencyPurchaseInvoiceItem (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// PATCH: Update foreignCurrencyPurchaseInvoiceItemQuantity for specific item
const patchForeignCurrencyPurchaseInvoiceItemQuantity = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId, productId } = req.params;
        const { foreignCurrencyPurchaseInvoiceItemQuantity } = req.body;

        if (foreignCurrencyPurchaseInvoiceItemQuantity == null) {
            return res.status(400).json({
                status: false,
                error: 'Missing foreignCurrencyPurchaseInvoiceItemQuantity in request body'
            });
        }

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            {
                foreignCurrencyPurchaseInvoiceId: parseInt(foreignCurrencyPurchaseInvoiceId),
                'foreignCurrencyPurchaseInvoiceItems.productId': parseInt(productId)
            },
            {
                $set: {
                    'foreignCurrencyPurchaseInvoiceItems.$.foreignCurrencyPurchaseInvoiceItemQuantity': foreignCurrencyPurchaseInvoiceItemQuantity
                }
            },
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice or item not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice item quantity updated successfully',
            data: updatedInvoice
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "patchForeignCurrencyPurchaseInvoiceItemQuantity"
        });
    }
};

const deleteForeignCurrencyPurchaseInvoiceItemByProductId = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId, productId } = req.params;

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            {
                foreignCurrencyPurchaseInvoiceId: parseInt(foreignCurrencyPurchaseInvoiceId),
                'foreignCurrencyPurchaseInvoiceItems.productId': parseInt(productId)
            },
            {
                $pull: {
                    foreignCurrencyPurchaseInvoiceItems: { productId: parseInt(productId) }
                }
            },
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice or item not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice item deleted successfully',
            data: updatedInvoice
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteForeignCurrencyPurchaseInvoiceItemByProductId"
        });
    }
};


// Delete purchase invoice
const deleteForeignCurrencyPurchaseInvoice = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId } = req.params;
        const deletedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndDelete({ foreignCurrencyPurchaseInvoiceId });

        if (!deletedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice deleted successfully',
            deletedID: foreignCurrencyPurchaseInvoiceId
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteForeignCurrencyPurchaseInvoice (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

// Delete purchase invoice item
const deleteForeignCurrencyPurchaseInvoiceItem = async (req, res) => {
    try {
        const { foreignCurrencyPurchaseInvoiceId, productId } = req.params;

        const updatedInvoice = await ForeignCurrencyPurchaseInvoice.findOneAndUpdate(
            { foreignCurrencyPurchaseInvoiceId },
            {
                $pull: {
                    foreignCurrencyPurchaseInvoiceItems: { productId: parseInt(productId) }
                }
            },
            { new: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedInvoice) {
            return res.status(404).json({
                status: false,
                error: 'Purchase invoice not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Purchase invoice item deleted successfully',
            data: updatedInvoice
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteForeignCurrencyPurchaseInvoiceItem (foreignCurrencyPurchaseInvoiceController)"
        });
    }
};

module.exports = {
    createForeignCurrencyPurchaseInvoice,
    addItemToForeignCurrencyPurchaseInvoice,
    getAllForeignCurrencyPurchaseInvoices,
    getForeignCurrencyPurchaseInvoiceById,
    getForeignCurrencyPurchaseInvoicesByVendor,
    getForeignCurrencyPurchaseInvoicesByStatus,
    getForeignCurrencyPurchaseInvoicesByDateRange,
    updateForeignCurrencyPurchaseInvoice,
    updateForeignCurrencyPurchaseInvoiceStatus,
    updateForeignCurrencyPurchaseInvoiceItem,
    patchForeignCurrencyPurchaseInvoiceItemQuantity,
    deleteForeignCurrencyPurchaseInvoice,
    deleteForeignCurrencyPurchaseInvoiceItem,
    deleteForeignCurrencyPurchaseInvoiceItemByProductId
};