const Card = require('../models/cardModel.js');

// Create a new card
const createCard = async (req, res) => {
    try {
        const { cardNumber, cardTitleAr, cardTitleEN, categoryID } = req.body;

        // Check if cardTitleAr or cardTitleEN already exists
        const existingCard = await Card.findOne({
            $or: [
                { cardTitleAr: cardTitleAr },
                { cardTitleEN: cardTitleEN }
            ]
        });

        if (existingCard) {
            return res.status(400).json({
                error: `Duplicate value detected. ${existingCard.cardTitleAr === cardTitleAr
                    ? ` Card title ar,`
                    : ''
                    }${existingCard.cardTitleEN === cardTitleEN
                        ? ` Card title en`
                        : ''
                    }`
            });
        }

        // Create a new card without specifying cardID (auto-incremented)
        const card = new Card({ cardNumber, cardTitleAr, cardTitleEN, categoryID });

        // Save the new card to the database
        await card.save();

        // Respond with success
        res.status(201).json({ message: 'Card created successfully', card });
    } catch (error) {
        // Handle other errors and respond
        res.status(400).json({ error: error.message });
    }
};



// Get all cards
const getCards = async (req, res) => {
    try {
        const cards = await Card.find().select({
            _id: 0, "__v": 0,
        }).sort({ cardID: 1 });

        let cardsData = {
            "status": true,
            "cardsData": cards
        }
        if (!cards) {
            let cardsData = {
                "status": true,
                "cardsData": []
            }
            return res.status(404).send(cardsData);
        }
        else {

            return res.status(200).send(cardsData)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a card by ID
const getCardById = async (req, res) => {
    try {
        const { cardID } = req.params
        const card = await Card.findOne({ cardID });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a card
const updateCard = async (req, res) => {
    try {
        const { cardID } = req.params
        const { cardTitleAr, cardTitleEN, categoryID } = req.body;
        const card = await Card.findOneAndUpdate(
            { cardID },
            { cardTitleAr, cardTitleEN, categoryID },
            { new: true }
        );
        if (!card) return res.status(404).json({ message: 'Card not found' });
        res.status(200).json({ message: 'Card updated successfully', card });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a card
const deleteCard = async (req, res) => {
    try {
        const { cardID } = req.params
        const card = await Card.findOneAndDelete({ cardID });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Create a new card
const createFullCard = async (req, res) => {
    try {
        const { cardNumber, cardTitleAr, cardTitleEN, categoryID } = req.body;

        // Check if cardTitleAr or cardTitleEN already exists
        const existingCard = await Card.findOne({
            $or: [
                { cardTitleAr: cardTitleAr },
                { cardTitleEN: cardTitleEN }
            ]
        });

        if (existingCard) {
            return res.status(400).json({
                error: `Duplicate value detected. ${existingCard.cardTitleAr === cardTitleAr
                    ? ` Card title ar,`
                    : ''
                    }${existingCard.cardTitleEN === cardTitleEN
                        ? ` Card title en`
                        : ''
                    }`
            });
        }

        // Create a new card without specifying cardID (auto-incremented)
        const card = new Card({ cardNumber, cardTitleAr, cardTitleEN, categoryID });

        // Save the new card to the database
        await card.save();

        // Respond with success
        res.status(201).json({ message: 'Card created successfully', card });
    } catch (error) {
        // Handle other errors and respond
        res.status(400).json({ error: error.message });
    }
};



// Get all cards
const getFullCards = async (req, res) => {
    try {
        const cards = await Card.find().select({
            _id: 0, "__v": 0,
        }).sort({ cardID: 1 });

        let cardsData = {
            "status": true,
            "cardsData": cards
        }
        if (!cards) {
            let cardsData = {
                "status": true,
                "cardsData": []
            }
            return res.status(404).send(cardsData);
        }
        else {

            return res.status(200).send(cardsData)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a card by ID
const getFullCardById = async (req, res) => {
    try {
        const { cardID } = req.params
        const card = await Card.findOne({ cardID });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a card
const updateFullCard = async (req, res) => {
    try {
        const { cardID } = req.params
        const { cardTitleAr, cardTitleEN, categoryID } = req.body;
        const card = await Card.findOneAndUpdate(
            { cardID },
            { cardTitleAr, cardTitleEN, categoryID },
            { new: true }
        );
        if (!card) return res.status(404).json({ message: 'Card not found' });
        res.status(200).json({ message: 'Card updated successfully', card });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a card
const deleteFullCard = async (req, res) => {
    try {
        const { cardID } = req.params
        const card = await Card.findOneAndDelete({ cardID });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCard,
    getCards,
    getCardById,
    updateCard,
    deleteCard,
    createFullCard,
    getFullCards,
    getFullCardById,
    updateFullCard,
    deleteFullCard,
};
