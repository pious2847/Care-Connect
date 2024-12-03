const mongoose = require("mongoose");

const StaffsSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      enum: ['Mr', 'Ms', 'Prof', "Dr", "Miss", ]
    },
    firstname: {
      type: String,
      require: true,
      trim: true,
    },
    middlename: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      require: true,
      trim: true,
      enum: ["male", "female", "others"],
    },
    dob: {
      type: String,
      require: true,
    },
    cardnumber: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    maritalstatus: {
      type: String,
      trim: true,
      require: true,
    },
    staffId:{
      type: String,
      trim: true,
      unique: true,
    },
    position: {
      type: String,
      enum: ["admin", "specialist", "midwife", "doctor", "nurse"],
    },
    status: {
      type: String,
      enum: ["active", "onleave", "offline"],
    },
    facilityId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'facilityType', 
    },
    facilityType: {
      type: String,
      required: true,
      enum: ['pharmacies', 'hospitals'], // Must match one of these models
    },
    contact: {
      type: String,
      trim: true,
      require: true,
    },
    profile: {
     picture: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          trim: true,
      },
      publicId:{
        type: String
      }
    },
    password: {
      type: String,
      require: true,
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Staffs", StaffsSchema);
