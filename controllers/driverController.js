const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const asyncHandler = require('express-async-handler')
const Driver = require('../models/driverModel')
const cloudinary = require('../utils/cloudinary')

//Register Driver
const driverRegister = asyncHandler (async (req,res) => {
    try {
    const { name, email, phoneNumber, password, profilePhoto, driverLicenceFront, drivingLicenceRear } = req.body
    

    if(!name, !email, !phoneNumber, !password, !profilePhoto, driverLicenceFront, !drivingLicenceRear) {
        res.status(400)
        throw new Error("Please Add All Fields")
    }

    //Check if driver exists
    const driverExists = await Driver.findOne({email:email})
    if(driverExists) {
        res.status(400)
        throw new Error("Driver Already Exists")
    } else {
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const profileImg = await cloudinary.uploader.upload(profilePhoto, {
            folder: 'profilePic',
        })
       

        const licenceFront = await cloudinary.uploader.upload(driverLicenceFront, {
            folder: 'drivingLicence'
        })

        const licenceRear = await cloudinary.uploader.upload(drivingLicenceRear, {
            folder: 'drivingLicence'
        })

        const driver = await Driver.create({
            name, email, phoneNumber,
            password: hashedPassword,
            profilePhoto : profileImg.url,
            driverLicenceFront: licenceFront.url,
            drivingLicenceRear:licenceRear.url
        })

        if(driver) {
            res.status(201).json({
                message: 'Your Account is Waiting for our Administrator approval, Please  check back later.'
            })
        } else {
            res.status(400)
            throw new Error('Something went wrong')
        }
    }
    } catch (error) {
    res.status(500).send({message: "Internal Server Error"})
    }
})


const driverLogin = asyncHandler(async (req,res) => {
    try {
    const { email, password } = req.body
    if(!email || !password) {
        res.status(400) 
        throw new Error('Please fill all the Fields')
    }

    //Check driver
    const driver = await Driver.findOne({ email: email})

    if(!driver) {
        res.status(400)
        throw new Error('Invalid Credentials')
    }

    if(driver.isBlocked) {
        res.status(400)
        throw new Error('Account Blocked')
    }

    if(!driver.isApproved) {
        res.status(400)
        throw new Error('Your Account is waiting for our Administrator approval, Please check back later.')
    }

    if(driver && (await bcrypt.compare(password, driver.password)) && !driver.isBlocked && driver.isApproved) {
        res.status(200).json({
            _id: driver.id,
            name: driver.name,
            email: driver.email,
            profilePhoto: driver.profilePhoto.url,
            phoneNumber: driver.phoneNumber,
            token: generateToken(driver._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
    } catch (error) {
        res.status(500).send({message: "Internal Server Error"})
    }
})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWTPRIVATEKEY, {
        expiresIn: '10d'
    })
}

module.exports = {
    driverRegister,
    driverLogin
}