const express = require('express');
const router = express.Router();
const drugsController = require('../controller/drugs.controller');

// Routes for drugs
router.post('/create', drugsController.createDrug);
router.get('/', drugsController.getAllDrugs);
router.get('/search', drugsController.searchDrugs);
router.put('/:drugId', drugsController.updateDrug);
router.delete('/:drugId', drugsController.deleteDrug);

module.exports = router;