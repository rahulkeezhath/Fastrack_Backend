const mongoose = require('mongoose')

const  availablePlaceSchema = mongoose.Schema({
    place: {
        type: String,
        required: [true, 'Please add Place'],
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model('AvailablePlace', availablePlaceSchema)