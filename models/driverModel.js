const mongoose = require('mongoose')

const driverSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Add Name']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please Add Phone Number']
    },
    email: {
        type: String,
        required: [true, 'Please Add Email'],
        unique:true
    },
    password: {
        type: String,
        required: [true, 'Please Add Email']
    },
    profilePhoto: {
        type: String,
        required: true
    },
    driverLicenceFront: {
        type: String,
        required: true
    },
    drivingLicenceRear: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps:true})


module.exports = mongoose.model('driver',driverSchema)