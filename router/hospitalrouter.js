const express = require('express')
const router = express.Router();
const hospitalController = require('../controller/hospitalsControllers')
const upload = require('../config/multer_file_uploader');
const MecicalRecordsController = require('../controller/medicalrecords.controller');


router.post('/hospital/register', upload.fields([
    {name: 'logo', maxCount: 1}
]), hospitalController.createHospital)

router.post('/medical-records/create', MecicalRecordsController.createMedicalRecord)
router.post('/login', hospitalController.login);

router.get('/logout', hospitalController.logout);

module.exports = router