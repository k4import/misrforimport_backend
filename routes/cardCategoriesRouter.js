const express = require('express');
const router = express.Router();
const CardCategoryController = require('../controllers/cardCategoriesController.js');

router.post('/AddNewCardCategory', CardCategoryController.addNewCardCategory);
router.get('/GetAllCardCategories', CardCategoryController.getAllCardCategories);
router.get('/GetCardCategoryByID/:cardCategoryID', CardCategoryController.getCardCategoryById);
router.put('/UpdateCardCategoryByID/:cardCategoryID', CardCategoryController.updateCardCategory);
router.delete('/DeleteCardCategoryByID/:cardCategoryID', CardCategoryController.deleteCardCategory);

module.exports = router;