const SalesInvoice = require('../models/eGPSalesInvoiceModel');

// Create new sales invoice
const createSalesInvoice = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['invoiceTypeEGPSalesInvoice', 'clientId', 'warehouseId', 'employeeIdEGPSalesInvoice', 'itemsEGPSalesInvoice'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: false,
          error: `Missing required field: ${field}`,
          location: 'createSalesInvoice'
        });
      }
    }

    // Validate items array
    if (!Array.isArray(req.body.itemsEGPSalesInvoice) || req.body.itemsEGPSalesInvoice.length === 0) {
      return res.status(400).json({
        status: false,
        error: 'At least one item is required',
        location: 'createSalesInvoice'
      });
    }

    // Calculate totals if not provided
    if (!req.body.financialsEGPSalesInvoice) {
      const itemsTotal = req.body.itemsEGPSalesInvoice.reduce((total, item) => {
        return total + (item.pricingItemEGPSalesInvoice?.totalPriceEGPSalesInvoice || 0);
      }, 0);

      req.body.financialsEGPSalesInvoice = {
        totalsEGPSalesInvoice: {
          itemsTotalAmountEGPSalesInvoice: itemsTotal,
          discountsEGPSalesInvoice: [],
          vatTaxesEGPSalesInvoice: [],
          otherTaxesEGPSalesInvoice: [],
          netTotalEGPSalesInvoice: itemsTotal
        },
        paymentsEGPSalesInvoice: {
          paymentStatusEGPSalesInvoice: 'unpaid',
          totalPaidAmountEGPSalesInvoice: 0,
          remainingAmountEGPSalesInvoice: itemsTotal,
          paymentsListEGPSalesInvoice: []
        }
      };
    }

    // Set default date if not provided
    if (!req.body.dateEGPSalesInvoice) {
      req.body.dateEGPSalesInvoice = new Date();
    }

    const invoice = new SalesInvoice(req.body);
    await invoice.save();
    
    const responseInvoice = invoice.toObject();
    delete responseInvoice._id;
    delete responseInvoice.__v;

    res.status(201).json({
      status: true,
      message: 'Sales invoice created successfully',
      invoice: responseInvoice
    });
  } catch (error) {
    console.error('Error creating sales invoice:', error);
    res.status(error.code === 11000 ? 409 : 400).json({
      status: false,
      error: error.message,
      code: error.code,
      location: 'createSalesInvoice'
    });
  }
};

// Get all sales invoices with pagination and filtering
const getAllSalesInvoices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      clientId, 
      employeeId, 
      startDate, 
      endDate,
      sortBy = 'salesInvoiceIdEGPSalesInvoice',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.statusEGPSalesInvoice = status;
    if (clientId) filter.clientId = parseInt(clientId);
    if (employeeId) filter.employeeIdEGPSalesInvoice = parseInt(employeeId);
    if (startDate || endDate) {
      filter.dateEGPSalesInvoice = {};
      if (startDate) filter.dateEGPSalesInvoice.$gte = new Date(startDate);
      if (endDate) filter.dateEGPSalesInvoice.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const invoices = await SalesInvoice.find(filter)
      .select({ _id: 0, __v: 0 })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SalesInvoice.countDocuments(filter);

    res.status(200).json({
      status: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: invoices
    });
  } catch (error) {
    console.error('Error getting sales invoices:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'getAllSalesInvoices' 
    });
  }
};

// Get sales invoice by ID
const getSalesInvoiceById = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice } = req.params;
    const invoice = await SalesInvoice.findOne({ salesInvoiceIdEGPSalesInvoice })
      .select({ _id: 0, __v: 0 });

    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    res.status(200).json({ 
      status: true, 
      data: invoice 
    });
  } catch (error) {
    console.error('Error getting sales invoice by ID:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'getSalesInvoiceById' 
    });
  }
};

// Get sales invoices by Client
const getSalesInvoicesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const invoices = await SalesInvoice.find({ clientId })
      .select({ _id: 0, __v: 0 })
      .sort({ dateEGPSalesInvoice: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SalesInvoice.countDocuments({ clientId });

    res.status(200).json({ 
      status: true, 
      count: invoices.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: invoices 
    });
  } catch (error) {
    console.error('Error getting sales invoices by client:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'getSalesInvoicesByClient' 
    });
  }
};

// Get sales invoices by status
const getSalesInvoicesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const invoices = await SalesInvoice.find({ statusEGPSalesInvoice: status })
      .select({ _id: 0, __v: 0 })
      .sort({ dateEGPSalesInvoice: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SalesInvoice.countDocuments({ statusEGPSalesInvoice: status });

    res.status(200).json({ 
      status: true, 
      count: invoices.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: invoices 
    });
  } catch (error) {
    console.error('Error getting sales invoices by status:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'getSalesInvoicesByStatus' 
    });
  }
};

// Get sales invoices by date range
const getSalesInvoicesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = {
      dateEGPSalesInvoice: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    const invoices = await SalesInvoice.find(filter)
      .select({ _id: 0, __v: 0 })
      .sort({ dateEGPSalesInvoice: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SalesInvoice.countDocuments(filter);

    res.status(200).json({ 
      status: true, 
      count: invoices.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: invoices 
    });
  } catch (error) {
    console.error('Error getting sales invoices by date range:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'getSalesInvoicesByDateRange' 
    });
  }
};

// Add item to sales invoice
const addItemToSalesInvoice = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice } = req.params;
    const newItem = req.body;

    const invoice = await SalesInvoice.findOne({ salesInvoiceIdEGPSalesInvoice });
    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    invoice.itemsEGPSalesInvoice.push(newItem);
    await invoice.save();

    res.status(200).json({ 
      status: true, 
      message: 'Item added successfully',
      data: invoice 
    });
  } catch (error) {
    console.error('Error adding item to sales invoice:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'addItemToSalesInvoice' 
    });
  }
};

// Update item in sales invoice
const updateItemInSalesInvoice = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice, itemId } = req.params;
    const updatedItem = req.body;

    const invoice = await SalesInvoice.findOne({ salesInvoiceIdEGPSalesInvoice });
    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    const itemIndex = invoice.itemsEGPSalesInvoice.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        status: false, 
        error: 'Item not found' 
      });
    }

    invoice.itemsEGPSalesInvoice[itemIndex] = { ...invoice.itemsEGPSalesInvoice[itemIndex].toObject(), ...updatedItem };
    await invoice.save();

    res.status(200).json({ 
      status: true, 
      message: 'Item updated successfully',
      data: invoice 
    });
  } catch (error) {
    console.error('Error updating item in sales invoice:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'updateItemInSalesInvoice' 
    });
  }
};

// Remove item from sales invoice
const removeItemFromSalesInvoice = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice, itemId } = req.params;

    const invoice = await SalesInvoice.findOne({ salesInvoiceIdEGPSalesInvoice });
    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    const itemIndex = invoice.itemsEGPSalesInvoice.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        status: false, 
        error: 'Item not found' 
      });
    }

    invoice.itemsEGPSalesInvoice.splice(itemIndex, 1);
    await invoice.save();

    res.status(200).json({ 
      status: true, 
      message: 'Item removed successfully',
      data: invoice 
    });
  } catch (error) {
    console.error('Error removing item from sales invoice:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'removeItemFromSalesInvoice' 
    });
  }
};

// Add payment to sales invoice
const addPaymentToSalesInvoice = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice } = req.params;
    const newPayment = req.body;

    const invoice = await SalesInvoice.findOne({ salesInvoiceIdEGPSalesInvoice });
    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    invoice.financialsEGPSalesInvoice.paymentsEGPSalesInvoice.paymentsListEGPSalesInvoice.push(newPayment);
    
    // Recalculate payment totals
    const totalPaid = invoice.financialsEGPSalesInvoice.paymentsEGPSalesInvoice.paymentsListEGPSalesInvoice.reduce(
      (total, payment) => total + payment.paidAmountEGPSalesInvoice, 0
    );
    
    invoice.financialsEGPSalesInvoice.paymentsEGPSalesInvoice.totalPaidAmountEGPSalesInvoice = totalPaid;
    invoice.financialsEGPSalesInvoice.paymentsEGPSalesInvoice.remainingAmountEGPSalesInvoice = 
      invoice.financialsEGPSalesInvoice.totalsEGPSalesInvoice.netTotalEGPSalesInvoice - totalPaid;

    await invoice.save();

    res.status(200).json({ 
      status: true, 
      message: 'Payment added successfully',
      data: invoice 
    });
  } catch (error) {
    console.error('Error adding payment to sales invoice:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'addPaymentToSalesInvoice' 
    });
  }
};

// Update sales invoice
const updateSalesInvoice = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice } = req.params;
    const updateData = req.body;

    const invoice = await SalesInvoice.findOneAndUpdate(
      { salesInvoiceIdEGPSalesInvoice },
      updateData,
      { new: true, runValidators: true }
    ).select({ _id: 0, __v: 0 });

    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    res.status(200).json({ 
      status: true, 
      message: 'Sales invoice updated successfully',
      data: invoice 
    });
  } catch (error) {
    console.error('Error updating sales invoice:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'updateSalesInvoice' 
    });
  }
};

// Update sales invoice status
const updateSalesInvoiceStatus = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice } = req.params;
    const { statusEGPSalesInvoice } = req.body;

    const invoice = await SalesInvoice.findOneAndUpdate(
      { salesInvoiceIdEGPSalesInvoice },
      { statusEGPSalesInvoice },
      { new: true, runValidators: true }
    ).select({ _id: 0, __v: 0 });

    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    res.status(200).json({ 
      status: true, 
      message: 'Sales invoice status updated successfully',
      data: invoice 
    });
  } catch (error) {
    console.error('Error updating sales invoice status:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'updateSalesInvoiceStatus' 
    });
  }
};

// Get sales invoice statistics
const getSalesInvoiceStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.dateEGPSalesInvoice = {};
      if (startDate) filter.dateEGPSalesInvoice.$gte = new Date(startDate);
      if (endDate) filter.dateEGPSalesInvoice.$lte = new Date(endDate);
    }

    const [
      totalInvoices,
      draftInvoices,
      confirmedInvoices,
      paidInvoices,
      cancelledInvoices,
      totalRevenue,
      totalPaidAmount
    ] = await Promise.all([
      SalesInvoice.countDocuments(filter),
      SalesInvoice.countDocuments({ ...filter, statusEGPSalesInvoice: 'draft' }),
      SalesInvoice.countDocuments({ ...filter, statusEGPSalesInvoice: 'confirmed' }),
      SalesInvoice.countDocuments({ ...filter, statusEGPSalesInvoice: 'paid' }),
      SalesInvoice.countDocuments({ ...filter, statusEGPSalesInvoice: 'cancelled' }),
      SalesInvoice.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$financialsEGPSalesInvoice.totalsEGPSalesInvoice.netTotalEGPSalesInvoice' } } }
      ]),
      SalesInvoice.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$financialsEGPSalesInvoice.paymentsEGPSalesInvoice.totalPaidAmountEGPSalesInvoice' } } }
      ])
    ]);

    res.status(200).json({
      status: true,
      data: {
        totalInvoices,
        draftInvoices,
        confirmedInvoices,
        paidInvoices,
        cancelledInvoices,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalPaidAmount: totalPaidAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error getting sales invoice statistics:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'getSalesInvoiceStatistics' 
    });
  }
};

// Delete sales invoice
const deleteSalesInvoice = async (req, res) => {
  try {
    const { salesInvoiceIdEGPSalesInvoice } = req.params;

    const invoice = await SalesInvoice.findOneAndDelete({ salesInvoiceIdEGPSalesInvoice });
    if (!invoice) {
      return res.status(404).json({ 
        status: false, 
        error: 'Sales invoice not found' 
      });
    }

    res.status(200).json({ 
      status: true, 
      message: 'Sales invoice deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting sales invoice:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message, 
      location: 'deleteSalesInvoice' 
    });
  }
};

module.exports = {
  createSalesInvoice,
  getAllSalesInvoices,
  getSalesInvoiceById,
  getSalesInvoicesByClient,
  getSalesInvoicesByStatus,
  getSalesInvoicesByDateRange,
  addItemToSalesInvoice,
  updateItemInSalesInvoice,
  removeItemFromSalesInvoice,
  addPaymentToSalesInvoice,
  updateSalesInvoice,
  updateSalesInvoiceStatus,
  getSalesInvoiceStatistics,
  deleteSalesInvoice
};
