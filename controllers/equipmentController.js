const Equipment = require('../models/equipmentModel.js');

// Create a new equipment
const createEquipment = async (req, res) => {
    try {
        const { equipmentType, equipmentModelCode, equipmentBrand, equipmentMfgYear } = req.body;

        // Check for existing equipment by model code and brand
        const existingEquipment = await Equipment.findOne({
            equipmentModelCode,
            equipmentBrand
        }).select({ _id: 0, __v: 0 });

        if (existingEquipment) {
            return res.status(409).json({
                status: false,
                error: `Conflict: Equipment with model code "${equipmentModelCode}" and brand "${equipmentBrand}" already exists`
            });
        }

        // Create and save new equipment
        const equipment = new Equipment({
            equipmentType,
            equipmentModelCode,
            equipmentBrand,
            equipmentMfgYear
        });

        await equipment.save();

        const responseEquipment = equipment.toObject();
        delete responseEquipment._id;
        delete responseEquipment.__v;

        res.status(201).json({
            status: true,
            message: 'Equipment created successfully',
            equipment: responseEquipment
        });
    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createEquipment (equipmentController)"
        });
    }
};

// Get all equipment
const getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find()
            .select({ _id: 0, __v: 0 })
            .sort({ equipmentId: 1 });

        res.status(200).json({
            status: true,
            count: equipment.length,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getEquipment (equipmentController)"
        });
    }
};

// Get equipment by ID
const getEquipmentById = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const equipment = await Equipment.findOne({ equipmentId })
            .select({ _id: 0, __v: 0 });

        if (!equipment) {
            return res.status(404).json({
                status: false,
                error: 'Equipment not found'
            });
        }

        res.status(200).json({
            status: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getEquipmentById (equipmentController)"
        });
    }
};

// Update equipment
const updateEquipment = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const updateFields = req.body;

        const updatedEquipment = await Equipment.findOneAndUpdate(
            { equipmentId },
            updateFields,
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedEquipment) {
            return res.status(404).json({
                status: false,
                error: 'Equipment not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Equipment updated successfully',
            data: updatedEquipment
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateEquipment (equipmentController)"
        });
    }
};

// Delete equipment
const deleteEquipment = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const deletedEquipment = await Equipment.findOneAndDelete({ equipmentId });

        if (!deletedEquipment) {
            return res.status(404).json({
                status: false,
                error: 'Equipment not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Equipment deleted successfully',
            deletedID: equipmentId
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteEquipment (equipmentController)"
        });
    }
};

module.exports = {
    createEquipment,
    getEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
};
