const mongoose = require('mongoose')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')


const adminSchema = new mongoose.Schema({
    userName: {
        type:String,
        required:[true, 'Please Add UserName']
    },
    adminId: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:[true, 'Please Type Password']
    }
})



const Admin = mongoose.model("admin",adminSchema)

const validate = (data)=> {
    const schema = Joi.object({
        userName:Joi.string().required().label("UserName"),
        password:passwordComplexity().required().label("Password")
    })
    return schema.validate(data)
}

module.exports = {Admin, validate}