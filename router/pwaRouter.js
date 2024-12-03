const express = require("express");
const PwaController = require("../controller/pwaController");
const router = express.Router();


router.get('/manifest.json', PwaController.getManifest)
router.get('/service-worker.js', PwaController.getServiceWorker)

module.exports = router