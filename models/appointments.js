const mongoose = require('mongoose')


const AppointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true
    },
    date:{
        type: Date,
        require: true,
        trim: true
    },
    time:{
        type: String,
        require: true,
        trim: true
    },
    field:{
        type: String,
        require: true,
        trim: true
    },
    message:{
        type: String,
        require: true,
        trim: true
    },
    isAttended:{
        type: Boolean,
        default: false
    },
    facility:{
        type: mongoose.Schema.ObjectId,
        ref: 'Hospitals'
    }
});

const Appointments = mongoose.model('Appointments', AppointmentSchema);

module.exports = Appointments;