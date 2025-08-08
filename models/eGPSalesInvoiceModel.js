const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { format } = require('date-fns');

const Schema = mongoose.Schema;

// Sub-schema for Discounts
const DiscountSchema = new Schema({
  discountIdEGPSalesInvoice: { 
    type: Number, 
    required: true 
  },
  discountTypeEGPSalesInvoice: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountPercentageEGPSalesInvoice: { 
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return this.discountTypeEGPSalesInvoice === 'percentage' ? v >= 0 && v <= 100 : true;
      },
      message: 'Discount percentage must be between 0 and 100'
    }
  },
  discountValueEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  },
  reasonEGPSalesInvoice: { 
    type: String, 
    default: '' 
  }
}, { _id: false });

// Sub-schema for VAT Taxes
const VATTaxSchema = new Schema({
  vatTaxNameEGPSalesInvoice: { 
    type: String, 
    required: true 
  },
  vatTaxPercentageEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  vatTaxValueEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { _id: false });

// Sub-schema for Other Taxes
const OtherTaxSchema = new Schema({
  taxIdEGPSalesInvoice: { 
    type: Number, 
    required: true 
  },
  taxNameEGPSalesInvoice: { 
    type: String, 
    required: true 
  },
  taxPercentageEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  vatValueEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { _id: false });

// Sub-schema for Totals
const TotalsSchema = new Schema({
  itemsTotalAmountEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  },
  discountsEGPSalesInvoice: [DiscountSchema],
  vatTaxesEGPSalesInvoice: [VATTaxSchema],
  otherTaxesEGPSalesInvoice: [OtherTaxSchema],
  netTotalEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { _id: false });

// Sub-schema for Payment Currency
const PaymentCurrencySchema = new Schema({
  currencyCodeEGPSalesInvoice: { 
    type: String, 
    required: true,
    enum: ['EGP', 'USD', 'EUR']
  },
  currencyExchangeRateEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { _id: false });

// Sub-schema for Payments List
const PaymentListSchema = new Schema({
  paymentMethodEGPSalesInvoice: { 
    type: String, 
    required: true,
    enum: ['cash', 'bank transfer', 'credit card', 'check', 'mobile payment']
  },
  paidAmountEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  },
  paymentCurrencyEGPSalesInvoice: PaymentCurrencySchema,
  paymentDateEGPSalesInvoice: { 
    type: Date, 
    required: true 
  },
  paymentStatusEGPSalesInvoice: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected'], 
    required: true 
  },
  bankNameEGPSalesInvoice: { 
    type: String 
  },
  bankAccountNumberEGPSalesInvoice: { 
    type: String 
  },
  transactionReferenceEGPSalesInvoice: { 
    type: String 
  },
  cardTypeEGPSalesInvoice: { 
    type: String, 
    default: null 
  },
  cardLast4DigitsEGPSalesInvoice: { 
    type: String, 
    default: null 
  },
  notesEGPSalesInvoice: { 
    type: String, 
    default: '' 
  }
}, { _id: false });

// Sub-schema for Payments
const PaymentsSchema = new Schema({
  paymentStatusEGPSalesInvoice: { 
    type: String, 
    enum: ['unpaid', 'partial', 'paid'], 
    required: true 
  },
  totalPaidAmountEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  },
  remainingAmountEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 0
  },
  paymentsListEGPSalesInvoice: [PaymentListSchema]
}, { _id: false });

// Sub-schema for Financials
const FinancialsSchema = new Schema({
  totalsEGPSalesInvoice: TotalsSchema,
  paymentsEGPSalesInvoice: PaymentsSchema
}, { _id: false });

// Sub-schema for Items
const ItemSchema = new Schema({
  productId: { 
    type: Number, 
    required: true 
  },
  quantityItemEGPSalesInvoice: { 
    type: Number, 
    required: true,
    min: 1
  },
  pricingItemEGPSalesInvoice: {
    perUnitPriceEGPSalesInvoice: { 
      type: Number, 
      required: true,
      min: 0
    },
    totalPriceEGPSalesInvoice: { 
      type: Number, 
      required: true,
      min: 0
    }
  },
  warrantyPeriodDaysEGPSalesInvoice: { 
    type: Number, 
    default: 0,
    min: 0
  },
  itemNotesEGPSalesInvoice: { 
    type: String, 
    default: '' 
  }
}, { _id: true, id: false });

// Main Sales Invoice Schema
const SalesInvoiceSchema = new Schema({
  salesInvoiceIdEGPSalesInvoice: { 
    type: Number
  },
  invoiceNumberEGPSalesInvoice: { 
    type: String
  },
  invoiceTypeEGPSalesInvoice: { 
    type: String, 
    enum: ['taxable', 'non-taxable'], 
    required: true 
  },
  statusEGPSalesInvoice: { 
    type: String, 
    enum: ['draft', 'confirmed', 'cancelled', 'paid'], 
    default: 'draft', 
    required: true 
  },
  dateEGPSalesInvoice: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  clientId: { 
    type: Number, 
    required: true 
  },
  warehouseId: { 
    type: Number, 
    required: true 
  },
  salesChannelEGPSalesInvoice: { 
    type: String, 
    default: '',
    enum: ['Online', 'Offline', 'Phone', 'Email', 'Direct']
  },
  employeeIdEGPSalesInvoice: { 
    type: Number, 
    required: true 
  },
  financialsEGPSalesInvoice: FinancialsSchema,
  itemsEGPSalesInvoice: [ItemSchema],
  notesEGPSalesInvoice: { 
    type: String, 
    default: '' 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// AutoIncrement Plugin
SalesInvoiceSchema.plugin(AutoIncrement, { inc_field: 'salesInvoiceIdEGPSalesInvoice' });

// Counter for Invoice Numbers
const SalesInvoiceCounter = mongoose.model('SalesInvoiceCounter', new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
}));

// Generate invoice number before saving
SalesInvoiceSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.invoiceNumberEGPSalesInvoice) {
    const year = format(new Date(), 'yyyy');
    const counter = await SalesInvoiceCounter.findByIdAndUpdate(
      { _id: 'salesInvoiceNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.invoiceNumberEGPSalesInvoice = `EGP-SI-${year}-${counter.seq.toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for calculating total items
SalesInvoiceSchema.virtual('totalItems').get(function() {
  return this.itemsEGPSalesInvoice.reduce((total, item) => total + item.quantityItemEGPSalesInvoice, 0);
});

// Virtual for calculating total amount before discounts
SalesInvoiceSchema.virtual('totalBeforeDiscounts').get(function() {
  return this.itemsEGPSalesInvoice.reduce((total, item) => total + item.pricingItemEGPSalesInvoice.totalPriceEGPSalesInvoice, 0);
});

// Virtual for calculating total discounts
SalesInvoiceSchema.virtual('totalDiscounts').get(function() {
  if (!this.financialsEGPSalesInvoice || !this.financialsEGPSalesInvoice.totalsEGPSalesInvoice) return 0;
  return this.financialsEGPSalesInvoice.totalsEGPSalesInvoice.discountsEGPSalesInvoice.reduce((total, discount) => total + discount.discountValueEGPSalesInvoice, 0);
});

// Virtual for calculating total taxes
SalesInvoiceSchema.virtual('totalTaxes').get(function() {
  if (!this.financialsEGPSalesInvoice || !this.financialsEGPSalesInvoice.totalsEGPSalesInvoice) return 0;
  return this.financialsEGPSalesInvoice.totalsEGPSalesInvoice.vatTaxesEGPSalesInvoice.reduce((total, tax) => total + tax.vatTaxValueEGPSalesInvoice, 0);
});

// Middleware to validate payment status consistency
SalesInvoiceSchema.pre('save', function(next) {
  if (this.financialsEGPSalesInvoice && this.financialsEGPSalesInvoice.paymentsEGPSalesInvoice) {
    const payments = this.financialsEGPSalesInvoice.paymentsEGPSalesInvoice;
    const netTotal = this.financialsEGPSalesInvoice.totalsEGPSalesInvoice.netTotalEGPSalesInvoice;
    
    // Update payment status based on amounts
    if (payments.totalPaidAmountEGPSalesInvoice >= netTotal) {
      payments.paymentStatusEGPSalesInvoice = 'paid';
      this.statusEGPSalesInvoice = 'paid';
    } else if (payments.totalPaidAmountEGPSalesInvoice > 0) {
      payments.paymentStatusEGPSalesInvoice = 'partial';
    } else {
      payments.paymentStatusEGPSalesInvoice = 'unpaid';
    }
    
    // Calculate remaining amount
    payments.remainingAmountEGPSalesInvoice = netTotal - payments.totalPaidAmountEGPSalesInvoice;
  }
  next();
});

// Ensure Unique Indexes
SalesInvoiceSchema.index({ salesInvoiceIdEGPSalesInvoice: 1 }, { unique: true });
SalesInvoiceSchema.index({ invoiceNumberEGPSalesInvoice: 1 }, { unique: true });
SalesInvoiceSchema.index({ clientId: 1 });
SalesInvoiceSchema.index({ employeeIdEGPSalesInvoice: 1 });
SalesInvoiceSchema.index({ dateEGPSalesInvoice: 1 });

// Export Model
module.exports = mongoose.model('SalesInvoice', SalesInvoiceSchema);
