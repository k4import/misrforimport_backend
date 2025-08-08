const express = require('express');
const router = express.Router()
const productController = require('../controllers/productsController.js');

// Create a new Card
router.post('/AddNewCardProduct', productController.createNewCardProduct);

// Create a new card only (without parts)
router.post('/AddNewCardOnly', productController.createNewCardOnly);

// Create a new product
router.post('/AddNewProduct', productController.createProduct);


// Get all products
router.get('/GetAllProducts', productController.getProducts);

// Get a product by ID
router.get('/GetProductByID/:productID', productController.getProductById);

// Update a product
router.put('/UpdateProductByID/:productID', productController.updateProduct);

// Delete a product
router.delete('/DeleteProductByID/:productID', productController.deleteProduct);

// Increase product quantity (NEW ENDPOINT)
router.patch('/IncreaseProductQuantityByProductID/:productID', productController.increaseProductQuantityByProductID);

module.exports = router;
