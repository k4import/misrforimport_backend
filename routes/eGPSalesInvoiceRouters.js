const express = require('express');
const router = express.Router();
const eGPSalesInvoiceController = require('../controllers/eGPSalesInvoiceController.js');

// ========================================
// CRUD Operations
// ========================================

// Create a new EGPSales invoice
router.post('/AddNewEGPSalesInvoice', eGPSalesInvoiceController.createSalesInvoice);

// Get all EGPSales invoices with pagination and filtering
router.get('/GetAllEGPSalesInvoices', eGPSalesInvoiceController.getAllSalesInvoices);

// Get EGPSales invoice by ID
router.get('/GetEGPSalesInvoiceById/:salesInvoiceIdEGPSalesInvoice', eGPSalesInvoiceController.getSalesInvoiceById);

// Update full EGPSales invoice
router.put('/UpdateEGPSalesInvoice/:salesInvoiceIdEGPSalesInvoice', eGPSalesInvoiceController.updateSalesInvoice);

// Update EGPSales invoice status only
router.patch('/UpdateEGPSalesInvoiceStatus/:salesInvoiceIdEGPSalesInvoice', eGPSalesInvoiceController.updateSalesInvoiceStatus);

// Delete EGPSales invoice
router.delete('/DeleteEGPSalesInvoice/:salesInvoiceIdEGPSalesInvoice', eGPSalesInvoiceController.deleteSalesInvoice);

// ========================================
// Filtering Operations
// ========================================

// Get EGPSales invoices by client
router.get('/GetEGPSalesInvoicesByClient/:clientId', eGPSalesInvoiceController.getSalesInvoicesByClient);

// Get EGPSales invoices by status
router.get('/GetEGPSalesInvoicesByStatus/:status', eGPSalesInvoiceController.getSalesInvoicesByStatus);

// Get EGPSales invoices by date range
router.get('/GetEGPSalesInvoicesByDateRange/:startDate/:endDate', eGPSalesInvoiceController.getSalesInvoicesByDateRange);

// ========================================
// Items Management
// ========================================

// Add item to existing EGPSales invoice
router.post('/AddItemToEGPSalesInvoice/:salesInvoiceIdEGPSalesInvoice', eGPSalesInvoiceController.addItemToSalesInvoice);

// Update item in EGPSales invoice
router.put('/UpdateItemInEGPSalesInvoice/:salesInvoiceIdEGPSalesInvoice/:itemId', eGPSalesInvoiceController.updateItemInSalesInvoice);

// Remove item from EGPSales invoice
router.delete('/RemoveItemFromEGPSalesInvoice/:salesInvoiceIdEGPSalesInvoice/:itemId', eGPSalesInvoiceController.removeItemFromSalesInvoice);

// ========================================
// Payment Management
// ========================================

// Add payment to EGPSales invoice
router.post('/AddPaymentToEGPSalesInvoice/:salesInvoiceIdEGPSalesInvoice', eGPSalesInvoiceController.addPaymentToSalesInvoice);

// ========================================
// Analytics & Statistics
// ========================================

// Get EGPSales invoice statistics
router.get('/GetEGPSalesInvoiceStatistics', eGPSalesInvoiceController.getSalesInvoiceStatistics);

module.exports = router;
