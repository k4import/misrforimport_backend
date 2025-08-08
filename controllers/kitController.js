const Kit = require('../models/kitModel.js');

const addKit = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { partID, kitNameAR, kitNameEn, cardID, minQty, kitPrice, strategy, tGS1CodeID, tHSCodeID, tEGS1CodeID, lengthCM, widthCM, heightCM, outerCm, inner, kitComponentes } = req.body;

        // Create a new kit. kitID will be auto-generated.
        const kit = new Kit({
            partID,
            kitNameAR,
            kitNameEn,
            cardID,
            minQty,
            kitPrice,
            strategy,
            tGS1CodeID,
            tHSCodeID,
            tEGS1CodeID,
            lengthCM,
            widthCM,
            heightCM,
            outerCm,
            inner,
            kitComponentes,
        });

        // Save the new kit to the database
        await kit.save();

        res.status(201).json({ message: 'Kit added successfully', kit });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



// Get all kits
const  getAllKits = async (req, res) => {
    try {
        const kits = await Kit.find({});
        res.json(kits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a kit by ID
const getKitById = async (req, res) => {
    try {
        const {kitID} = req.params
        const kit = await Kit.findOne({kitID});
        if (!kit) return res.status(404).json({ error: 'Kit not found' });
        res.json(kit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a kit by ID
const updateKitById = async (req, res) => {
    try {
        const {kitID} = req.params
        const updatedKit = await Kit.findOneAndUpdate(
            {kitID} ,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedKit) return res.status(404).json({ error: 'Kit not found' });
        res.json({ message: 'Kit updated successfully', updatedKit });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a kit by ID
const deleteKitById = async (req, res) => {
    try {
        const {kitID} = req.params
        const deletedKit = await Kit.findOneAndDelete({kitID});
        if (!deletedKit) return res.status(404).json({ error: 'Kit not found' });
        res.json({ message: 'Kit deleted successfully'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Stream data
// /controllers/kitsController.js

const getAllKitsStream = async (req, res) => {
    try {
        // Fetch initial data from the database
        const kits = await Kit.find({});

        // Set the headers for Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();  // Ensure headers are sent immediately

        // Send initial data to the client
        res.write(`data: ${JSON.stringify({"kits":kits})}\n\n`);

        // Create the change stream for real-time updates
        const changeStream = Kit.watch();

        // Listen for changes and send updates to the client
        changeStream.on('change', (change) => {
            // Only send data if the response is still open
            if (res.writableEnded) {
                console.log("Client disconnected, stopping change stream.");
                return;
            }

            const data = {
                operationType: change.operationType,
                documentKey: change.documentKey,
                fullDocument: change.fullDocument,
                updateDescription: change.updateDescription,
            };

            // Send the change data as an event to the client
            res.write(`data: ${JSON.stringify({ type: 'change', data })}\n\n`);
        });

        // Handle client disconnection
        req.on('close', () => {
            console.log('Client disconnected');
            // Close the change stream when the client disconnects
            try {
                changeStream.close();
            } catch (error) {
                console.error('Error closing change stream:', error.message);
            }
        });

        // Handle any errors in the change stream
        changeStream.on('error', (error) => {
            console.error('Error in change stream:', error.message);
            if (!res.writableEnded) {
                res.status(500).json({ error: 'Error in change stream' });
            }
        });

    } catch (err) {
        // Handle any errors that occur while setting up the stream
        console.error('Error in getAllKitsStream:', err.message);
        res.status(500).json({ error: err.message });
    }
};





module.exports = {
    addKit,
    getAllKits,
    getKitById,
    updateKitById,
    deleteKitById,
    getAllKitsStream
}