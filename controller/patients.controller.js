const Patient = require('../models/patients');
const Hospitals = require('../models/hospitals');
const MedicalRecord = require('../models/MedicalRecord');
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const bcrypt = require('bcrypt')

const patientController = {
    // Create new patient
    async createPatient(req, res) {
        const { facilityId, password } = req.body


        // Handle profile picture upload if provided
        let profilePicture = {
            picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId: null
        };
        const hashedPassword = await bcrypt.hash(password, 10);

        if (req.files && req.files.profilePicture) {
            const result = await cloudinary.uploader.upload(
                req.files.profilePicture[0].path,
                {
                    folder: "patients",
                    width: 300,
                    crop: "scale"
                }
            );
            profilePicture = {
                picture: result.secure_url,
                publicId: result.public_id
            };
        }

        // Create patient
        const patient = await Patient.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: new Date(req.body.dateOfBirth),
            gender: req.body.gender,
            contact: {
                phone: req.body.phone,
                email: req.body.email,
                emergencyContact: {
                    name: req.body.emergencyContactName,
                    relationship: req.body.emergencyContactRelationship,
                    phone: req.body.emergencyContactPhone
                }
            },
            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                country: req.body.country
            },
            bloodGroup: req.body.bloodGroup,
            allergies: req.body.allergies ? req.body.allergies.split(',').map(allergy => allergy.trim()) : [],
            chronicConditions: req.body.chronicConditions ? req.body.chronicConditions.split(',').map(condition => condition.trim()) : [],
            registeredHospitals: [{
                hospital: facilityId,
                registrationDate: new Date()
            }],
            profilePicture,
            password: hashedPassword
        });

        // Add patient to hospital's patient list
        await Hospitals.findByIdAndUpdate(facilityId, {
            $push: { patients: patient._id }
        });

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: patient
        });
    },

    // Update patient information
    async updatePatient(req, res) {
        const { patientId } = req.params;
        const facilityId = req.hospital.id;

        // Verify patient belongs to hospital
        const hospital = await Hospitals.findById(facilityId);
        if (!hospital.patients.includes(patientId)) {
            throw new AppError('Patient not found in this hospital', 404);
        }

        // Handle profile picture update if provided
        if (req.files && req.files.profilePicture) {
            // Delete old profile picture if it exists
            const patient = await Patient.findById(patientId);
            if (patient.profilePicture.publicId) {
                await cloudinary.uploader.destroy(patient.profilePicture.publicId);
            }

            // Upload new profile picture
            const result = await cloudinary.uploader.upload(
                req.files.profilePicture[0].path,
                {
                    folder: "patients",
                    width: 300,
                    crop: "scale"
                }
            );
            req.body.profilePicture = {
                picture: result.secure_url,
                publicId: result.public_id
            };
        }

        // Update patient data
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    dateOfBirth: req.body.dateOfBirth,
                    gender: req.body.gender,
                    'contact.phone': req.body.phone,
                    'contact.email': req.body.email,
                    'contact.emergencyContact.name': req.body.emergencyContactName,
                    'contact.emergencyContact.relationship': req.body.emergencyContactRelationship,
                    'contact.emergencyContact.phone': req.body.emergencyContactPhone,
                    'address.street': req.body.street,
                    'address.city': req.body.city,
                    'address.state': req.body.state,
                    'address.zipCode': req.body.zipCode,
                    'address.country': req.body.country,
                    bloodGroup: req.body.bloodGroup,
                    allergies: req.body.allergies ? req.body.allergies.split(',').map(allergy => allergy.trim()) : undefined,
                    chronicConditions: req.body.chronicConditions ? req.body.chronicConditions.split(',').map(condition => condition.trim()) : undefined,
                    ...(req.body.profilePicture && { profilePicture: req.body.profilePicture })
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Patient information updated successfully',
            data: updatedPatient
        });
    },

    // Delete patient
   async deletePatient(req, res){
        const { patientId } = req.params;
        const hospitalId = req.hospital.id;

        // Verify patient belongs to hospital
        const hospital = await Hospitals.findById(hospitalId);
        if (!hospital.patients.includes(patientId)) {
            throw new AppError('Patient not found in this hospital', 404);
        }

        const patient = await Patient.findById(patientId);

        // Remove patient from hospital's patient list
        await Hospitals.findByIdAndUpdate(hospitalId, {
            $pull: { patients: patientId }
        });

        // Remove hospital from patient's registered hospitals
        await Patient.findByIdAndUpdate(patientId, {
            $pull: { registeredHospitals: { hospital: hospitalId } }
        });

        // If patient is not registered with any other hospital, delete completely
        const updatedPatient = await Patient.findById(patientId);
        if (updatedPatient.registeredHospitals.length === 0) {
            // Delete profile picture from cloudinary if exists
            if (patient.profilePicture.publicId) {
                await cloudinary.uploader.destroy(patient.profilePicture.publicId);
            }

            // Delete all medical records associated with this patient
            await MedicalRecord.deleteMany({ _id: { $in: patient.medicalRecords } });

            // Delete patient document
            await Patient.findByIdAndDelete(patientId);
        }

        res.status(200).json({
            success: true,
            message: 'Patient removed successfully'
        });
    },


};

module.exports = patientController;