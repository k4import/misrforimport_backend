const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Create a new card
router.post('/AddNewCard', cardController.createCard);

// Get all cards
router.get('/GetAllCards', cardController.getCards);

// Get a card by ID
router.get('/GetCardByID/:cardID', cardController.getCardById);

// Update a card
router.put('/UpdateCardByID/:cardID', cardController.updateCard);

// Delete a card
router.delete('/DeleteCardByID/:cardID', cardController.deleteCard);


// Create a new card
router.post('/AddNewFullCard', cardController.createFullCard);

// Get all cards
router.get('/GetAllFullCards', cardController.getFullCards);

// Get a card by ID
router.get('/GetFullCardByID/:cardID', cardController.getFullCardById);

// Update a card
router.put('/UpdateFullCardByID/:cardID', cardController.updateFullCard);

// Delete a card
router.delete('/DeleteFullCardByID/:cardID', cardController.deleteFullCard);

module.exports = router;
