const mongoose = require('mongoose');

const Reviewschema = new mongoose.Schema({
    comments: {
        type:String,
        trim: true,
        require: true,
        unique: true
    },
    review:{
        type : String,
        enum : ['satisfied', 'unsatisfied']
    },
    facilityId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Reviews"
        }
    ]

});

const Reviews = mongoose.model('Reviews', Reviewschema);

module.exports = Reviews;