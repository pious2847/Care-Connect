const express = require('express');
const AppointmentController = require('../controller/appointment.controller');
const router = express.Router();

router.get('/room/:roomId', AppointmentController.getmeeting)
router.post('/book-Appointment', AppointmentController.createAppointment)

module.exports = router;