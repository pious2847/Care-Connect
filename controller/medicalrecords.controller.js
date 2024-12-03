const MedicalRecord = require('../models/MedicalRecord');
const mongoose = require('mongoose');
const patients = require('../models/patients');



const MecicalRecordsController = {
    // @desc    Create a new medical record
// @route   POST /api/medical-records
    async createMedicalRecord(req, res) {
        try {
            const {
                hospital,
                admissionDate,
                dischargeDate,
                diagnosis,
                treatment,
                medications,
                notes,
                billingStatus,
                billingDetails,
                patientId,
                admitedBy
            } = req.body;


            const patient = await patients.findById(patientId);
            
            // Create new medical record
            const newMedicalRecord = new MedicalRecord({
                hospital,
                admissionDate,
                dischargeDate,
                diagnosis,
                treatment,
                medications,
                notes,
                admitedBy,
                billingStatus,
                billingDetails: {
                    dailyRate: billingDetails.dailyRate,
                    // totalAmount will be auto-calculated via pre-save middleware
                }
            });

            // Save the medical record
            const savedRecord = await newMedicalRecord.save();
            patient.medicalRecords.push(savedRecord._id);
            await patient.save();

            // Return the created medical record
            res.status(201).json({
                success: true,
                data: savedRecord
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },
    async getMedicalRecords(req, res) {
        try {
            // Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skipIndex = (page - 1) * limit;

            // Filtering
            const query = {};
            if (req.query.hospital) {
                query.hospital = req.query.hospital;
            }
            if (req.query.billingStatus) {
                query.billingStatus = req.query.billingStatus;
            }

            // Sorting
            const sortOptions = {
                admissionDate: req.query.sort === 'oldest' ? 1 : -1
            };

            const totalRecords = await MedicalRecord.countDocuments(query);
            const medicalRecords = await MedicalRecord.find(query)
                .populate('hospital')
                .sort(sortOptions)
                .skip(skipIndex)
                .limit(limit);

            res.status(200).json({
                success: true,
                count: medicalRecords.length,
                total: totalRecords,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalRecords / limit)
                },
                data: medicalRecords
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    // @desc    Get single medical record by ID
    // @route   GET /api/medical-records/:id
    async getMedicalRecordById(req, res) {
        try {
            // Validate MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid medical record ID'
                });
            }

            const medicalRecord = await MedicalRecord.findById(req.params.id)
                .populate('hospital');

            if (!medicalRecord) {
                return res.status(404).json({
                    success: false,
                    error: 'Medical record not found'
                });
            }

            res.status(200).json({
                success: true,
                data: medicalRecord
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
    // @desc    Update medical record
    // @route   PUT /api/medical-records/:id
    async updateMedicalRecord(req, res) {
        try {
            // Validate MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid medical record ID'
                });
            }

            const {
                hospital,
                admissionDate,
                dischargeDate,
                diagnosis,
                treatment,
                medications,
                notes,
                billingStatus,
                billingDetails
            } = req.body;

            const medicalRecord = await MedicalRecord.findByIdAndUpdate(
                req.params.id,
                {
                    hospital,
                    admissionDate,
                    dischargeDate,
                    diagnosis,
                    treatment,
                    medications,
                    notes,
                    billingStatus,
                    billingDetails: {
                        dailyRate: billingDetails.dailyRate,
                        // totalAmount will be auto-calculated via pre-save middleware
                    }
                },
                {
                    new: true,  // Return updated document
                    runValidators: true  // Run model validation
                }
            );

            if (!medicalRecord) {
                return res.status(404).json({
                    success: false,
                    error: 'Medical record not found'
                });
            }

            res.status(200).json({
                success: true,
                data: medicalRecord
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },
    // @desc    Delete medical record
    // @route   DELETE /api/medical-records/:id
    async deleteMedicalRecord(req, res) {
        try {
            // Validate MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid medical record ID'
                });
            }

            const medicalRecord = await MedicalRecord.findByIdAndDelete(req.params.id);

            if (!medicalRecord) {
                return res.status(404).json({
                    success: false,
                    error: 'Medical record not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Medical record deleted successfully',
                deletedRecord: medicalRecord
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}


module.exports = MecicalRecordsController;