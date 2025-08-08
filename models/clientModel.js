const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const clientPhoneSchema = new mongoose.Schema({
    clientPhoneId: { type: String, required: true },
    clientPhoneTitle: { type: String, required: true },
    clientPhoneNumber: { type: String, required: true }
}, { _id: false });

const clientEmailSchema = new mongoose.Schema({
    clientEmailId: { type: String, required: true },
    clientEmailTitle: { type: String, required: true },
    clientEmailAdress: { type: String, required: true }
}, { _id: false });

const clientEqupModelSchema = new mongoose.Schema({
    clientEquipmentId: { type: String, required: true },
    clientEquipmentTitle: { type: String, required: true },
    clientEquipmentCode: { type: String, required: true }
}, { _id: false });

const clientSchema = new mongoose.Schema({
    clientID: { type: Number },
    clientName: { type: String, required: true },
    clientPhones: { type: [clientPhoneSchema], default: [] },
    vendorEmail: { type: [clientEmailSchema], default: [] },
    clientEqupModel: { type: [clientEqupModelSchema], default: [] },
    clientTaxNumber: { type: String },
    clientISCompany: { type: Boolean, default: false }
}, {
    timestamps: false,
    __v: false
});

clientSchema.plugin(AutoIncrement, { inc_field: 'clientID' });
clientSchema.index({ clientID: 1 }, { unique: true });

module.exports = mongoose.model('Clients', clientSchema);