const express = require('express')
const router = express.Router();
const PhamarcyController = require('../controller/pharmacyController')
const upload = require('../config/multer_file_uploader');


router.post('/pharmacy/register', upload.fields([
    {name: 'logo', maxCount: 1}
]), PhamarcyController.createPhamarcies)

module.exports = router