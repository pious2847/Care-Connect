const mongoose = require("mongoose");



const PatientSchema = new mongoose.Schema({
  firstName: {
      type: String,
      required: true,
      trim: true
  },
  lastName: {
      type: String,
      required: true,
      trim: true
  },
  dateOfBirth: {
      type: Date,
      required: true
  },
  gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
  },
  contact: {
      phone: {
          type: String,
          required: true,
          trim: true
      },
      email: {
          type: String,
          trim: true
      },
      emergencyContact: {
          name: String,
          relationship: String,
          phone: String
      }
  },
  address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
  },
  bloodGroup: {
      type: String,
      trim: true
  },
  allergies: [{
      type: String,
      trim: true
  }],
  chronicConditions: [{
      type: String,
      trim: true
  }],
  // Track which hospitals the patient has records in
  registeredHospitals: [{
      hospital: {
          type: mongoose.Schema.ObjectId,
          ref: 'Hospitals'
      },
      registrationDate: {
          type: Date,
          default: Date.now
      }
  }],
  // Reference to all medical records
  medicalRecords: [{
      type: mongoose.Schema.ObjectId,
      ref: 'MedicalRecords'
  }],
  // For tracking current admission status
  currentAdmission: {
      isAdmitted: {
          type: Boolean,
          default: false
      },
      hospital: {
          type: mongoose.Schema.ObjectId,
          ref: 'Hospitals'
      },
      admissionDate: Date,
      ward: String,
      bedNumber: String
  },
  profilePicture: {
      picture: {
          type: String,
          default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          trim: true,
      },
      publicId: {
          type: String
      }
  },
  password:{
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Patient", PatientSchema);
