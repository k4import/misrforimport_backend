const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { format } = require('date-fns');

// Schema for Purchase Invoice Items
const foreignCurrencyPurchaseInvoiceItemSchema = new mongoose.Schema({
    foreignCurrencyPurchaseInvoiceItemId: { type: Number },
    productId: {
        type: Number,
        required: true
    },
    foreignCurrencyPurchaseInvoiceItemQuantity: {
        type: Number,
        required: true
    },
    foreignCurrencyPurchaseInvoiceItemCost: {
        perUnit: {
            foreignCurrencyPurchaseInvoiceItemFCCostPerUnit: {
                type: Number,
                required: true
            },
            foreignCurrencyPurchaseInvoiceItemEGPCostPerUnit: {
                type: Number,
                required: true
            }
        },
        total: {
            foreignCurrencyPurchaseInvoiceItemTotalFCCost: {
                type: Number,
                required: true
            },
            foreignCurrencyPurchaseInvoiceItemTotalEGPCost: {
                type: Number,
                required: true
            }
        }
    },
    foreignCurrencyPurchaseInvoiceItemNotes: {
        type: String,
        default: ""
    }
}, { _id: true, id: false });

// Main Purchase Invoice Schema
const foreignCurrencyPurchaseInvoiceSchema = new mongoose.Schema({
    foreignCurrencyPurchaseInvoiceId: {
        type: Number
    },
    foreignCurrencyPurchaseInvoiceNumber: {
        type: String
    },
    foreignCurrencyPurchaseInvoiceStatus: {
        type: String,
        required: true,
        enum: ['ordered', 'shipped', 'received', 'paid', 'waybill'],
        default: 'ordered'
    },

    foreignCurrencyPurchaseInvoiceDates: {
        foreignCurrencyPurchaseInvoiceOrderedDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        foreignCurrencyPurchaseInvoiceExpectedDate: {
            type: Date
        },
        foreignCurrencyPurchaseInvoiceReceivedDate: {
            type: Date
        }
    },
    vendorId: {
        type: Number,
        required: true
    },
    foreignCurrencyPurchaseInvoiceCurrency: {
        foreignCurrencyPurchaseInvoiceCurrencyCode: {
            type: String,
            required: true
        },
        foreignCurrencyPurchaseInvoiceCurrencyExchangeRate: {
            type: Number,
            required: true
        }
    },
    foreignCurrencyPurchaseInvoiceShipping: {
        foreignCurrencyPurchaseInvoiceShippingMethod: {
            type: String
        },
        foreignCurrencyPurchaseInvoiceShippingCost: {
            foreignCurrencyPurchaseInvoiceFCShippingCost: {
                type: Number,
                default: 0
            },
            foreignCurrencyPurchaseInvoiceEGPShippingCost: {
                type: Number,
                default: 0
            }
        }
    },
    foreignCurrencyPurchaseInvoiceCosts: {
        foreignCurrencyPurchaseInvoiceFreight: {
            foreignCurrencyPurchaseInvoiceFCFreightCost: {
                type: Number,
                default: 0
            },
            foreignCurrencyPurchaseInvoiceEGPFreightCost: {
                type: Number,
                default: 0
            }
        },
        foreignCurrencyPurchaseInvoiceImport: {
            foreignCurrencyPurchaseInvoiceFCIMPCost: {
                type: Number,
                default: 0
            },
            foreignCurrencyPurchaseInvoiceEGPIMPCost: {
                type: Number,
                default: 0
            }
        }
    },
    foreignCurrencyPurchaseInvoiceTotals: {
        foreignCurrencyPurchaseInvoiceFCTotalAmount: {
            type: Number,
            required: true
        },
        foreignCurrencyPurchaseInvoiceEGPTotalAmount: {
            type: Number,
            required: true
        }
    },

    employeeId: {
        type: Number,
        required: true
    }
    ,
    foreignCurrencyPurchaseInvoiceNotes: {
        type: String,
        default: ""
    },
    foreignCurrencyPurchaseInvoiceItems: [foreignCurrencyPurchaseInvoiceItemSchema]
}, {
    timestamps: true,
    versionKey: false
});

// Plugin for auto-incrementing foreignCurrencyPurchaseInvoiceId
foreignCurrencyPurchaseInvoiceSchema.plugin(AutoIncrement, { inc_field: 'foreignCurrencyPurchaseInvoiceId' });

// Create a counter for invoice items
const ForeignCurrencyPurchaseInvoiceItemCounter = mongoose.model('ForeignCurrencyPurchaseInvoiceItemCounter', new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}));

// Auto-increment item IDs before saving the document
foreignCurrencyPurchaseInvoiceSchema.pre('save', async function (next) {
    const doc = this;

    // Generate purchase invoice number if it doesn't exist
    if (!doc.foreignCurrencyPurchaseInvoiceNumber) {
        const year = format(new Date(), 'yyyy');
        const counter = await mongoose.model('ForeignCurrencyPurchaseInvoiceCounter').findByIdAndUpdate(
            { _id: 'foreignCurrencyPurchaseInvoiceNumber' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        doc.foreignCurrencyPurchaseInvoiceNumber = `PI-${year}-${counter.seq.toString().padStart(4, '0')}`;
    }

    // Auto-increment item IDs
    if (doc.foreignCurrencyPurchaseInvoiceItems && doc.foreignCurrencyPurchaseInvoiceItems.length > 0) {
        for (let i = 0; i < doc.foreignCurrencyPurchaseInvoiceItems.length; i++) {
            if (!doc.foreignCurrencyPurchaseInvoiceItems[i].foreignCurrencyPurchaseInvoiceItemId) {
                const counter = await ForeignCurrencyPurchaseInvoiceItemCounter.findByIdAndUpdate(
                    { _id: doc._id.toString() || 'new_doc' },
                    { $inc: { seq: 1 } },
                    { new: true, upsert: true }
                );
                doc.foreignCurrencyPurchaseInvoiceItems[i].foreignCurrencyPurchaseInvoiceItemId = counter.seq;
            }
        }
    }

    next();
});

// Create a counter collection for the invoice numbers
const ForeignCurrencyPurchaseInvoiceCounter = mongoose.model('ForeignCurrencyPurchaseInvoiceCounter', new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}));

// Ensure unique indexes
foreignCurrencyPurchaseInvoiceSchema.index({ foreignCurrencyPurchaseInvoiceId: 1 }, { unique: true });
foreignCurrencyPurchaseInvoiceSchema.index({ foreignCurrencyPurchaseInvoiceNumber: 1 }, { unique: true });

// Virtual for calculating totals automatically
foreignCurrencyPurchaseInvoiceSchema.virtual('calculatedTotals').get(function () {
    let fcTotal = 0;
    let egpTotal = 0;

    // Sum up all line items
    if (this.foreignCurrencyPurchaseInvoiceItems && this.foreignCurrencyPurchaseInvoiceItems.length) {
        this.foreignCurrencyPurchaseInvoiceItems.forEach(item => {
            fcTotal += item.foreignCurrencyPurchaseInvoiceItemCost.total.foreignCurrencyPurchaseInvoiceItemTotalFCCost || 0;
            egpTotal += item.foreignCurrencyPurchaseInvoiceItemCost.total.foreignCurrencyPurchaseInvoiceItemTotalEGPCost || 0;
        });
    }

    // Add shipping costs
    if (this.foreignCurrencyPurchaseInvoiceShipping && this.foreignCurrencyPurchaseInvoiceShipping.foreignCurrencyPurchaseInvoiceShippingCost) {
        fcTotal += this.foreignCurrencyPurchaseInvoiceShipping.foreignCurrencyPurchaseInvoiceShippingCost.foreignCurrencyPurchaseInvoiceFCShippingCost || 0;
        egpTotal += this.foreignCurrencyPurchaseInvoiceShipping.foreignCurrencyPurchaseInvoiceShippingCost.foreignCurrencyPurchaseInvoiceEGPShippingCost || 0;
    }

    // Add freight costs
    if (this.foreignCurrencyPurchaseInvoiceCosts && this.foreignCurrencyPurchaseInvoiceCosts.foreignCurrencyPurchaseInvoiceFreight) {
        fcTotal += this.foreignCurrencyPurchaseInvoiceCosts.foreignCurrencyPurchaseInvoiceFreight.foreignCurrencyPurchaseInvoiceFCFreightCost || 0;
        egpTotal += this.foreignCurrencyPurchaseInvoiceCosts.foreignCurrencyPurchaseInvoiceFreight.foreignCurrencyPurchaseInvoiceEGPFreightCost || 0;
    }

    // Add import costs
    if (this.foreignCurrencyPurchaseInvoiceCosts && this.foreignCurrencyPurchaseInvoiceCosts.foreignCurrencyPurchaseInvoiceImport) {
        fcTotal += this.foreignCurrencyPurchaseInvoiceCosts.foreignCurrencyPurchaseInvoiceImport.foreignCurrencyPurchaseInvoiceFCIMPCost || 0;
        egpTotal += this.foreignCurrencyPurchaseInvoiceCosts.foreignCurrencyPurchaseInvoiceImport.foreignCurrencyPurchaseInvoiceEGPIMPCost || 0;
    }

    return {
        fcTotal,
        egpTotal
    };
});

// Middleware to validate and update totals before saving
foreignCurrencyPurchaseInvoiceSchema.pre('validate', function (next) {
    const calculatedTotals = this.calculatedTotals;

    // Automatically update totals if they don't match the calculated values
    if (!this.foreignCurrencyPurchaseInvoiceTotals) {
        this.foreignCurrencyPurchaseInvoiceTotals = {};
    }

    if (this.foreignCurrencyPurchaseInvoiceTotals.foreignCurrencyPurchaseInvoiceFCTotalAmount !== calculatedTotals.fcTotal) {
        this.foreignCurrencyPurchaseInvoiceTotals.foreignCurrencyPurchaseInvoiceFCTotalAmount = calculatedTotals.fcTotal;
    }

    if (this.foreignCurrencyPurchaseInvoiceTotals.foreignCurrencyPurchaseInvoiceEGPTotalAmount !== calculatedTotals.egpTotal) {
        this.foreignCurrencyPurchaseInvoiceTotals.foreignCurrencyPurchaseInvoiceEGPTotalAmount = calculatedTotals.egpTotal;
    }

    next();
});

// Export the model
module.exports = mongoose.model('ForeignCurrencyPurchaseInvoice', foreignCurrencyPurchaseInvoiceSchema);