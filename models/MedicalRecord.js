const mongoose = require('mongoose');

// Medical Record Schema
const MedicalRecordSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hospitals',
        required: true
    },
    admissionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    admitedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staffs',
        required: true
    },
    dischargeDate: {
        type: Date
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    treatment: {
        type: String,
        required: true,
        trim: true
    },
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date
    }],
    notes: {
        type: String,
        trim: true
    },
    billingStatus: {
        type: String,
        enum: ['pending', 'billed', 'paid'],
        default: 'pending'
    },
    // For your per-patient billing system
    billingDetails: {
        daysAdmitted: {
            type: Number,
            default: 0
        },
        dailyRate: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});


MedicalRecordSchema.pre('save', function(next) {
    if (this.admissionDate && this.dischargeDate) {
        const msPerDay = 1000 * 60 * 60 * 24;
        this.billingDetails.daysAdmitted = Math.ceil(
            (this.dischargeDate - this.admissionDate) / msPerDay
        );
        this.billingDetails.totalAmount = 
            this.billingDetails.daysAdmitted * this.billingDetails.dailyRate;
    }
    next();
});


const MedicalRecord = mongoose.model('MedicalRecords', MedicalRecordSchema);

module.exports = MedicalRecord;