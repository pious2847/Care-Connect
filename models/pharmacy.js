const mongoose = require('mongoose');

const Pharmacieschema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        unique: true
    },
    bio: {
        type: String,
        trim: true
    },
    contact: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        require: true
    },
    username: {
        type: String,
        unique: true,
        trim: true
    },
    dispenseraddress: {
        type: String,
        require: true
    },
    wallet: {
        number: {
            type: String,
            trim: true,
            require: true
        },
        name: {
            type: String,
            trim: true,
            require: true
        }
    },

    ambulancecontact: {
        type: String,
        require: true,
        trim: true
    },
    subscriptionstatus: {
        type: String,
        enum: ['active', 'expired'],
        default: 'expired'
    },
    address: {
        type: String,
        trim: true,
        require: true
    },
    logo: {
        picture: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            trim: true,
        },
        publicId: {
            type: String
        }
    },
    staffs: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Staffs'
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Reviews"
        }
    ]

});

const Pharmacies = mongoose.model('Pharmacies', Pharmacieschema);

module.exports = Pharmacies;