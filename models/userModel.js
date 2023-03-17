const mongoose = require('mongoose')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')


const userSchema = new mongoose.Schema({
    fullName: {
        type:String, 
        required:[true, 'Please Add Name']
    },
    email:{
         type: String,
         required:true,
         unique: [true, 'Please Add Email']
    },
    phoneNumber:{
         type: String,
         required: [true, 'Please Add Phone Number']
    },
    password: {
        type: String,
        required:[true, 'Please Add Password']
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    
}, {timestamps: true})

const User = mongoose.model("user",userSchema)

const validation = (data)=>{
    const schema = Joi.object({
        fullName:Joi.string().required().label("Full Name"),
        email:Joi.string().email().required().label("Email"),
        phoneNumber:Joi.number().required().label("Phone Number"),
        password: passwordComplexity().required().label("Password")
    })
    return schema.validate(data)
}


module.exports = {User, validation}