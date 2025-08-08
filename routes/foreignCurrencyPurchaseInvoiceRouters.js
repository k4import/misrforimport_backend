const express = require('express');
const router = express.Router();
const foreignCurrencyPurchaseInvoiceController = require('../controllers/foreignCurrencyPurchaseInvoiceController.js');

// Create a new purchase invoice
router.post('/AddNewForeignCurrencyPurchaseInvoice', foreignCurrencyPurchaseInvoiceController.createForeignCurrencyPurchaseInvoice);

// Add item to an existing purchase invoice
router.post('/AddItemToForeignCurrencyPurchaseInvoice/:foreignCurrencyPurchaseInvoiceId', foreignCurrencyPurchaseInvoiceController.addItemToForeignCurrencyPurchaseInvoice);

// Get all purchase invoices
router.get('/GetAllForeignCurrencyPurchaseInvoices', foreignCurrencyPurchaseInvoiceController.getAllForeignCurrencyPurchaseInvoices);

// Get purchase invoice by ID
router.get('/GetForeignCurrencyPurchaseInvoiceById/:foreignCurrencyPurchaseInvoiceId', foreignCurrencyPurchaseInvoiceController.getForeignCurrencyPurchaseInvoiceById);

// Get purchase invoices by vendor
router.get('/GetForeignCurrencyPurchaseInvoicesByVendor/:vendorId', foreignCurrencyPurchaseInvoiceController.getForeignCurrencyPurchaseInvoicesByVendor);

// Get purchase invoices by status
router.get('/GetForeignCurrencyPurchaseInvoicesByStatus/:status', foreignCurrencyPurchaseInvoiceController.getForeignCurrencyPurchaseInvoicesByStatus);

// Get purchase invoices by date range
router.get('/GetForeignCurrencyPurchaseInvoicesByDateRange', foreignCurrencyPurchaseInvoiceController.getForeignCurrencyPurchaseInvoicesByDateRange);

// Update purchase invoice
router.put('/UpdateForeignCurrencyPurchaseInvoice/:foreignCurrencyPurchaseInvoiceId', foreignCurrencyPurchaseInvoiceController.updateForeignCurrencyPurchaseInvoice);

// Update purchase invoice status
router.patch('/UpdateForeignCurrencyPurchaseInvoiceStatus/:foreignCurrencyPurchaseInvoiceId', foreignCurrencyPurchaseInvoiceController.updateForeignCurrencyPurchaseInvoiceStatus);

// Update purchase invoice item
router.put('/UpdateForeignCurrencyPurchaseInvoiceItem/:foreignCurrencyPurchaseInvoiceId/:productId', foreignCurrencyPurchaseInvoiceController.updateForeignCurrencyPurchaseInvoiceItem);

router.patch('/UpdateForeignCurrencyPurchaseInvoiceItemQuantity/:foreignCurrencyPurchaseInvoiceId/:productId', foreignCurrencyPurchaseInvoiceController.patchForeignCurrencyPurchaseInvoiceItemQuantity);

// Delete purchase invoice
router.delete('/DeleteForeignCurrencyPurchaseInvoice/:foreignCurrencyPurchaseInvoiceId', foreignCurrencyPurchaseInvoiceController.deleteForeignCurrencyPurchaseInvoice);

// Delete purchase invoice item
router.delete('/DeleteForeignCurrencyPurchaseInvoiceItem/:foreignCurrencyPurchaseInvoiceId/:productId', foreignCurrencyPurchaseInvoiceController.deleteForeignCurrencyPurchaseInvoiceItemByProductId);

module.exports = router;