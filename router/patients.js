const express = require('express');
const patientController = require('../controller/patients.controller');
const router = express.Router();
const upload = require('../config/multer_file_uploader');



router.post('/patients/register', upload.fields([
    {name: 'profilePicture', maxCount: 1}
]), patientController.createPatient);

router.get('/dashboard/:accountType/:facilityId/patient/:patientId/:action',  patientController.admite_DischargePatient)

module.exports = router;
