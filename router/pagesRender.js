const express = require('express');
const RenderPages = require('../controller/pagesrender');
const { isLoggedIn ,preventLoggedInAccess, isServiceOwner} = require('../middleware/auth');
const purchaseController = require('../controller/paymentsController');
const router = express.Router();

router.get('/',  RenderPages.getHome)
router.get('/about',  RenderPages.getAbout)
router.get('/doctors',  RenderPages.getDoctors)
router.get('/contact',  RenderPages.getContacts)
router.get('/login', preventLoggedInAccess, RenderPages.getLogin)
router.get('/register',  RenderPages.getRegisteration)
router.get('/register/hospital',  RenderPages.getHospitalRegisteration)
router.get('/register/pharmacy',  RenderPages.getPharmacyRegisteration)

// dashboard pages
router.get('/dashboard/:accountType/:Id', isLoggedIn, RenderPages.getDashboard)
router.get('/dashboard/:accountType/:Id/staffs',  RenderPages.getFacilityStaffs)
router.get('/dashboard/:accountType/:Id/appointments',  RenderPages.getFacilityAppointments)
router.get('/dashboard/:accountType/facility/:Id/staffs',  RenderPages.getFacilityAppointments)
router.get('/dashboard/:accountType/facility/:Id/appointments',  RenderPages.getFacilityAppointments)
router.get('/dashboard/:accountType/:Id/patients',  RenderPages.getAllPatients)
router.get('/dashboard/:accountType/:Id/pharmacies', isServiceOwner, RenderPages.getAllRegisteredPharmacy)
router.get('/dashboard/:accountType/:Id/hospitals', isServiceOwner, RenderPages.getAllRegisteredHopitals)
router.get('/dashboard/:accountType/:Id/patient/:patientId',  RenderPages.getPatient)

// dashboard routes for phamarcy

router.get('/dashboard/:accountType/:Id/supplies',  RenderPages.getAllPharmacyDrugs)
router.get('/dashboard/:accountType/:Id/sales',  RenderPages.getAllPharmacySales)
// router.post('/dashboard/:accountType/:Id/pharmacies/:pharmacyId/staffs', isServiceOwner, RenderPages.addPharmacyStaff)
// router.post('/dashboard/:accountType/:Id/pharmacies/:pharmacyId/appointments', isServiceOwner, RenderPages.addPharmacyAppointment)
// router.post('/dashboard/:accountType/:Id/pharmacies/:pharmacyId/patients', isServiceOwner, RenderPages.addPharmacyPatient)
// router.delete('/dashboard/:accountType/:Id/pharmacies/:pharmacyId', isServiceOwner, RenderPages.deletePharmacy)


// payment webhook routes
router.post('/payments/webhook', purchaseController.handlePaystackWebhook)


module.exports = router

