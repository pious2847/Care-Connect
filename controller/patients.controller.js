const Patient = require('../models/patients');
const Hospitals = require('../models/hospitals');
const MedicalRecord = require('../models/MedicalRecord');
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const bcrypt = require('bcrypt');
const initiatePaystackPayment = require('../utils/payment');
const { generatePatientPaymentMessage, generateFacilityPaymentMessage } = require('../utils/messages');
const { sendEmail } = require('../utils/MailSender');

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

        req.flash('message', `${patient.firstName + ' ' + patient.lastName} Account has been registered successfully`);
        req.flash('status', 'success');
        res.redirect(`/login`)

    },

    async admitOrDischargePatient(req, res) {
        try {
            const { action, patientId, facilityId } = req.params;
            const patient = await Patient.findById(patientId);
            const facility = await Hospitals.findById(facilityId);

            if (!patient || !facility) {
                return res.status(404).redirect('/error');
            }

            if (action === 'admit') {
                // Check if patient is already admitted
                if (patient.currentAdmission.isAdmitted) {
                    req.flash('message', `${patient.fullName} is already admitted at ${facility.name}.`);
                    req.flash('status', 'danger');
                    return res.redirect(`/dashboard/hospitals/${facility._id}/patient/${patient._id}`);
                }

                // Ensure patient is in facility's patient list
                if (!facility.patients.includes(patient._id)) {
                    facility.patients.push(patient._id);
                    await facility.save();
                }

                // Update patient admission details
                patient.currentAdmission.isAdmitted = true;
                patient.currentAdmission.hospital = facility._id;
                patient.currentAdmission.admissionDate = new Date();
                patient.registeredHospitals.push({
                    hospital: facility._id,
                    registrationDate: new Date()
                });

                await patient.save();

                req.flash('message', `${patient.fullName} has been admitted successfully`);
                req.flash('status', 'success');
                return res.redirect(`/dashboard/hospitals/${facility._id}/patient/${patient._id}`);
            }

            if (action === 'discharge') {
                const medicalRecords = await MedicalRecord.findOne({
                    hospital: patient.currentAdmission.hospital,
                    admissionDate: patient.currentAdmission.admissionDate
                });

                if (!medicalRecords) {
                    req.flash('message', 'No medical records found for this admission');
                    req.flash('status', 'danger');
                    return res.redirect(`/dashboard/hospitals/${facility._id}/patient/${patient._id}`);
                }

                const patientBills = req.body.totalAmount || medicalRecords.billingDetails.totalAmount;

                // Payment initialization with error handling
                try {
                    const initializePatientPayment = await initiatePaystackPayment(
                        patient.contact.email,
                        patientBills,
                        { facility, patientId: patient, patientmedicalrecords: medicalRecords, paymenttype: 'medicalbills' }
                    );

                    const initializeFacilityPayment = await initiatePaystackPayment(
                        facility.email,
                        50,
                        { facilityId: facility, patientId: patient._id, paymenttype: 'servicescharges' }
                    );

                    // Send payment emails
                    await sendEmail(
                        facility.email,
                        'Patient Discharge Payment (service charges)',
                        await generateFacilityPaymentMessage(facility, patient, {
                            authorization_url: initializeFacilityPayment.authorization_url,
                            dischargeProcessingFee: 50
                        })
                    );

                    await sendEmail(
                        patient.contact.email,
                        `${patient.fullName} Medical Bill`,
                        await generatePatientPaymentMessage(patient, medicalRecords.billingDetails, initializePatientPayment.authorization_url)
                    );

                    req.flash('message', `${patient.fullName} will be discharged once payment is confirmed`);
                    req.flash('status', 'success');
                    res.redirect(`/dashboard/hospitals/${facility._id}/patient/${patient._id}`);

                } catch (paymentError) {
                    console.error('Payment initialization error:', paymentError);
                    req.flash('message', 'Failed to process discharge payment. Please try again.');
                    req.flash('status', 'danger');
                    res.redirect(`/dashboard/hospitals/${facility._id}/patient/${patient._id}`);
                }
            }
        } catch (error) {
            console.error('Patient Admission/Discharge Error:', error);
            req.flash('message', 'An unexpected error occurred. Please try again.');
            req.flash('status', 'danger');
            res.redirect('/dashboard');
        }
    },

    async searchPatient(req, res) {
        try {
            const { query } = req.query;
            const { Id, accountType, patientId } = req.params;
            const alertMessage = req.flash("message");
            const alertStatus = req.flash("status");
            const alert = { message: alertMessage, status: alertStatus };


            // Improved search logic
            const searchConditions = [
                { firstName: { $regex: new RegExp(query, 'i') } },
                { lastName: { $regex: new RegExp(query, 'i') } },
                { 'contact.email': { $regex: new RegExp(query, 'i') } }
            ];

            // If the query contains a space, try to split and search by first and last name
            if (query.includes(' ')) {
                const [firstName, ...lastNameParts] = query.split(' ');
                const lastName = lastNameParts.join(' ');

                searchConditions.push(
                    {
                        $and: [
                            { firstName: { $regex: new RegExp(firstName, 'i') } },
                            { lastName: { $regex: new RegExp(lastName, 'i') } }
                        ]
                    }
                );
            }

            // Search for patients
            const patients = await Patient.find({
                $or: searchConditions
            }).populate('registeredHospitals.hospital');

            let account = null;
            if (Id) {
                account = await Hospitals.findById(Id)
                    .populate('staffs')
                    .populate('appointments')
                    .populate('patients');
            }

            res.render('./Dashboard/patientsearch', {
                patients,
                accountType,
                account,
                alert,
                query
            });
        } catch (error) {
            console.error('Error searching patients:', error);
            res.status(500).json({ message: 'Error searching patients' });
        }
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
    async deletePatient(req, res) {
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