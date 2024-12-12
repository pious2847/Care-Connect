const express = require('express');
const router = express.Router();
const salesController = require('../controller/sales.controller');

// Routes for sales
router.post('/create', salesController.createSale);
router.get('/', salesController.getAllSales);
router.get('/search', salesController.searchSales);
router.get('/date-range', salesController.getSalesByDateRange);

module.exports = router;