const Product = require('../models/productsModel.js');
const mongoose = require('mongoose');


// Create a new product
const createNewCardProduct = async (req, res) => {
    try {
        // Ensure database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                status: false,
                error: "Database not ready. Please try again.",
                location: "createNewCardProduct (productsController)"
            });
        }

        let {
            cardARName,
            cardENName,
            cardCategory,
            cardDimensions,
            cardWeight,
            cardWeightIsBy,
            cardGS1Category,
            cardHSCode,
            cardEGS1CodeID,
            cardNotes,
            partNumber,
            partBrand,
            partMinimumQuantity,
            partNumberNotes,
            cardIsKit,
            kitComponents
        } = req.body;

        // ✅ جلب أعلى `cardNumber` ثم زيادته بمقدار 1
        const maxCard = await Product.findOne().sort({ cardNumber: -1 }).select('cardNumber').maxTimeMS(5000);

        const cardNumber = maxCard ? parseInt(maxCard.cardNumber) + 1 : 1;
        
        
        
        // ✅ التحقق من `kitComponents`
        if (!Array.isArray(kitComponents)) {
            kitComponents = [];
        } else {
            kitComponents = kitComponents.map(component => ({
                kitQuantityComponent: component.kitQuantityComponent,
                kitComponentProductID: component.kitComponentProductID
            }));
        }

        // ✅ إنشاء المنتج الجديد باستخدام `cardNumber` الجديد
        const product = new Product({
            cardNumber,
            cardARName,
            cardENName,
            cardCategory,
            cardDimensions,
            cardWeight,
            cardWeightIsBy,
            cardGS1Category,
            cardHSCode,
            cardEGS1CodeID,
            cardNotes,
            partNumber,
            partBrand,
            partMinimumQuantity,
            partNumberNotes,
            cardIsKit,
            kitComponents
        });

        await product.save();

        // ✅ تحويل المنتج إلى كائن عادي وإزالة `_id` و `__v`
        const responseProduct = product.toObject();
        delete responseProduct._id;
        delete responseProduct.__v;

        res.status(201).json({
            status: true,
            message: 'Product created successfully',
            product: responseProduct
        });

    } catch (error) {
        console.error('Error in createNewCardProduct:', error);
        res.status(error.code === 11000 ? 409 : 500).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createNewCardProduct (productsController)"
        });
    }
};


// Create a new product
const createProduct = async (req, res) => {
    try {
        let {
            cardNumber,
            cardARName,
            cardENName,
            cardCategory,
            cardDimensions,
            cardWeight,
            cardWeightIsBy,
            cardGS1Category,
            cardHSCode,
            cardEGS1CodeID,
            cardNotes,
            partNumber,
            partBrand,
            partMinimumQuantity,
            partNumberNotes,
            cardIsKit,
            kitComponents
        } = req.body;

        // Validate kitComponents
        if (!Array.isArray(kitComponents)) {
            kitComponents = [];
        } else {
            kitComponents = kitComponents.map(component => ({
                kitQuantityComponent: component.kitQuantityComponent,
                kitComponentProductID: component.kitComponentProductID
            }));
        }

        // Check for existing product
        const existingProduct = await Product.findOne({
            $and: [
                { partNumber },
                { partBrand }
            ]
        }).select({ _id: 0, __v: 0 });

        if (existingProduct) {
            return res.status(409).json({
                status: false,
                error: `Conflict: Product with partNumber "${partNumber}" and brand "${partBrand}" already exists`
            });
        }

        // Create and save new product
        const product = new Product({
            cardNumber,
            cardARName,
            cardENName,
            cardCategory,
            cardDimensions,
            cardWeight,
            cardWeightIsBy,
            cardGS1Category,
            cardHSCode,
            cardEGS1CodeID,
            cardNotes,
            partNumber,
            partBrand,
            partMinimumQuantity,
            partNumberNotes,
            cardIsKit,
            kitComponents
        });

        await product.save();

        // Convert to plain object and transform response
        const responseProduct = product.toObject();
        delete responseProduct._id;
        delete responseProduct.__v;

        res.status(201).json({
            status: true,
            message: 'Product created successfully',
            product: responseProduct
        });

    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createProduct (productsController)"
        });
    }
};

// Create a new card only (without parts)
const createNewCardOnly = async (req, res) => {
    try {
        let {
            cardARName,
            cardENName,
            cardCategory,
            cardDimensions,
            cardWeight,
            cardWeightIsBy,
            cardGS1Category,
            cardHSCode,
            cardEGS1CodeID,
            cardNotes,
            cardIsKit,
            kitComponents,
            compatibleEquipment
        } = req.body;

        // ✅ جلب أعلى `cardNumber` ثم زيادته بمقدار 1
        const maxCard = await Product.findOne().sort({ cardNumber: -1 }).select('cardNumber');
        const cardNumber = maxCard ? parseInt(maxCard.cardNumber) + 1 : 1;

        // ✅ التحقق من `kitComponents`
        if (!Array.isArray(kitComponents)) {
            kitComponents = [];
        } else {
            kitComponents = kitComponents.map(component => ({
                kitQuantityComponent: component.kitQuantityComponent,
                kitComponentProductID: component.kitComponentProductID
            }));
        }

        // ✅ التحقق من `compatibleEquipment`
        if (!Array.isArray(compatibleEquipment)) {
            compatibleEquipment = [];
        } else {
            compatibleEquipment = compatibleEquipment.map(equipment => ({
                equipmentId: equipment.equipmentId,
                equipmentType: equipment.equipmentType,
                equipmentModelCode: equipment.equipmentModelCode,
                equipmentBrand: equipment.equipmentBrand,
                equipmentMfgYear: equipment.equipmentMfgYear
            }));
        }

        // ✅ إنشاء المنتج الجديد مع part number افتراضي
        const product = new Product({
            cardNumber,
            cardARName,
            cardENName,
            cardCategory,
            cardDimensions,
            cardWeight,
            cardWeightIsBy,
            cardGS1Category,
            cardHSCode,
            cardEGS1CodeID,
            cardNotes,
            partNumber: `${cardNumber}-001`, // Part number افتراضي
            partBrand: "DEFAULT", // Brand افتراضي
            partMinimumQuantity: 0,
            partNumberNotes: "Default part created with card",
            cardIsKit,
            kitComponents,
            compatibleEquipment
        });

        await product.save();

        // ✅ تحويل المنتج إلى كائن عادي وإزالة `_id` و `__v`
        const responseProduct = product.toObject();
        delete responseProduct._id;
        delete responseProduct.__v;

        res.status(201).json({
            status: true,
            message: 'Card created successfully with default part',
            product: responseProduct
        });

    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createNewCardOnly (productsController)"
        });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .select({ _id: 0, __v: 0 })
            .sort({ productID: 1 });

        res.status(200).json({
            status: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getProducts (productsController)"
        });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { productID } = req.params;
        const product = await Product.findOne({ productID })
            .select({ _id: 0, __v: 0 });

        if (!product) {
            return res.status(404).json({
                status: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            status: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getProductById (productsController)"
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { productID } = req.params;
        const updateFields = req.body;

        // Remove forbidden fields if present
        delete updateFields.cardLocation;
        delete updateFields.cardWarehouse;
        delete updateFields.partQuantity;
        delete updateFields.partUSDPrice;
        delete updateFields.partEGPPrice;

        // Validate kitComponents
        if (updateFields.kitComponents) {
            updateFields.kitComponents = updateFields.kitComponents.map(component => ({
                kitQuantityComponent: component.kitQuantityComponent,
                kitComponentProductID: component.kitComponentProductID
            }));
        }

        // Validate compatibleEquipment
        if (updateFields.compatibleEquipment) {
            updateFields.compatibleEquipment = updateFields.compatibleEquipment.map(equipment => ({
                equipmentId: equipment.equipmentId,
                equipmentType: equipment.equipmentType,
                equipmentModelCode: equipment.equipmentModelCode,
                equipmentBrand: equipment.equipmentBrand,
                equipmentMfgYear: equipment.equipmentMfgYear
            }));
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { productID },
            updateFields,
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedProduct) {
            return res.status(404).json({
                status: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateProduct (productsController)"
        });
    }
};

// Increase product quantity by productID (using params)
const increaseProductQuantityByProductID = async (req, res) => {
    try {
        const { productID } = req.params;
        const { incrementQty } = req.body;

        // Validate input
        if (!productID || incrementQty === undefined || incrementQty < 0) {
            return res.status(400).json({
                status: false,
                error: 'productID (in URL) and positive incrementQty (in body) are required'
            });
        }

        // Find the product first
        const product = await Product.findOne({ productID }).select({ _id: 0, __v: 0 });
        
        if (!product) {
            return res.status(404).json({
                status: false,
                error: 'Product not found'
            });
        }

        // Calculate new quantity
        const newQuantity = product.partQuantity + incrementQty;

        // Update the product with the new quantity
        const updatedProduct = await Product.findOneAndUpdate(
            { productID },
            { partQuantity: newQuantity },
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        res.status(200).json({
            status: true,
            message: 'Product quantity increased successfully',
            data: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "increaseProductQuantityByProductID (productsController)"
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { productID } = req.params;
        const deletedProduct = await Product.findOneAndDelete({ productID });

        if (!deletedProduct) {
            return res.status(404).json({
                status: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Product deleted successfully',
            deletedID: productID
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteProduct (productsController)"
        });
    }
};

module.exports = {
    createNewCardProduct,
    createProduct,
    createNewCardOnly,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,

    increaseProductQuantityByProductID
};