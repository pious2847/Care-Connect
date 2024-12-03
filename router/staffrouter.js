const express = require('express');
const router = express.Router();
const StaffController = require('../controller/StaffController');
const upload = require('../config/multer_file_uploader');


// Routes with file upload
router.post('/staff', upload.fields([
    {name: 'profile', maxCount: 1}
]), StaffController.createStaff);

router.put('/staff/:id', upload.single('profile'), StaffController.updateStaff);
router.put('/staff/:id/profile-image', upload.single('profile'), StaffController.updateProfileImage);

// Other routes (no file upload)
router.get('/staff', StaffController.getstaffs);
router.get('/staff/:id', StaffController.getstaffsByID);
router.delete('/staff/:id', StaffController.deleteStaff);
// router.put('/staff/:id/password', StaffController.updatePassword);
// router.put('/staff/:id/status', StaffController.updateStatus);

module.exports = router;