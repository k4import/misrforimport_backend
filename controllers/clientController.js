const Client = require('../models/clientModel.js');

// Create a new client
const createClient = async (req, res) => {
    try {
        const {
            clientName,
            clientPhones,
            vendorEmail,
            clientEqupModel,
            clientTaxNumber,
            clientISCompany
        } = req.body;

        // Check for existing client by name or tax number
        const existingClient = await Client.findOne({
            $or: [
                { clientName },
                { clientTaxNumber }
            ]
        }).select({ _id: 0, __v: 0 });

        if (existingClient) {
            let conflictField = '';
            if (existingClient.clientName === clientName) conflictField = 'clientName';
            else if (existingClient.clientTaxNumber === clientTaxNumber) conflictField = 'clientTaxNumber';

            return res.status(409).json({
                status: false,
                error: `Conflict: Client with ${conflictField} "${req.body[conflictField]}" already exists`
            });
        }

        // Create and save new client
        const client = new Client({
            clientName,
            clientPhones,
            vendorEmail,
            clientEqupModel,
            clientTaxNumber,
            clientISCompany
        });

        await client.save();

        const responseClient = client.toObject();
        delete responseClient._id;
        delete responseClient.__v;

        res.status(201).json({
            status: true,
            message: 'Client created successfully',
            client: responseClient
        });
    } catch (error) {
        res.status(error.code === 11000 ? 409 : 400).json({
            status: false,
            error: error.message,
            code: error.code,
            location: "createClient (clientController)"
        });
    }
};

// Get all clients
const getClients = async (req, res) => {
    try {
        const clients = await Client.find()
            .select({ _id: 0, __v: 0 })
            .sort({ clientID: 1 });

        res.status(200).json({
            status: true,
            count: clients.length,
            data: clients
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getClients (clientController)"
        });
    }
};

// Get client by ID
const getClientById = async (req, res) => {
    try {
        const { clientID } = req.params;
        const client = await Client.findOne({ clientID })
            .select({ _id: 0, __v: 0 });

        if (!client) {
            return res.status(404).json({
                status: false,
                error: 'Client not found'
            });
        }

        res.status(200).json({
            status: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "getClientById (clientController)"
        });
    }
};

// Update client
const updateClient = async (req, res) => {
    try {
        const { clientID } = req.params;
        const updateFields = req.body;

        const updatedClient = await Client.findOneAndUpdate(
            { clientID },
            updateFields,
            { new: true, runValidators: true }
        ).select({ _id: 0, __v: 0 });

        if (!updatedClient) {
            return res.status(404).json({
                status: false,
                error: 'Client not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Client updated successfully',
            data: updatedClient
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.message,
            location: "updateClient (clientController)"
        });
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const { clientID } = req.params;
        const deletedClient = await Client.findOneAndDelete({ clientID });

        if (!deletedClient) {
            return res.status(404).json({
                status: false,
                error: 'Client not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Client deleted successfully',
            deletedID: clientID
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
            location: "deleteClient (clientController)"
        });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
}; 