const mongoose = require('mongoose')

const brandSchema = mongoose.Schema({
    brand:{
        type: String,
        required:[true, 'Please Add Brand'],
        unique:true
    }
},{timestamps:true})

module.exports = mongoose.model('brand',brandSchema)