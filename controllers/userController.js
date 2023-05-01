const { User} = require('../models/userModel')
const Cars = require('../models/carModel')
const Bookings = require('../models/bookingModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const asyncHandler = require('express-async-handler');
const {doSms, verifyOtp} = require('../helpers/otpVerification')
const { default: mongoose } = require("mongoose");
const moment = require('moment')
const Stripe = require('stripe')
const stripe = Stripe('sk_test_51Mg3gFSFAwfsuLHcq2QhP0MfWq9lShezSoFqHDSlhi9o0h8VTYkEkNyH9Uqr8IQ9jkIfQbdYBHi4iDQWPOlumv1n00CYybWskj')


const userSignup = asyncHandler(async(req,res)=>{
    try{
     const { fullName, email, phoneNumber, password} = req.body

     if(!fullName || !email || !phoneNumber || !password) {
        res.status(400)
        throw new Error("Please Add all Fields")
     }

     // Check if user Exists
     const userExists = await User.findOne({email})

     if(userExists) {
        res.status(400)
        throw new Error('User already exists')
     }

    // Send OTP

    const otpSend = await doSms(phoneNumber)
    if(otpSend) {
        res.status(200).json(true)
    }
    } catch (error) {
    res.status(500).send({message: "Internal Server Error"}) 
}

})


const otpVerification = asyncHandler(async (req,res) => {
    try {
    const { fullName, email, password, phoneNumber, otpCode } = req.body
    const otpVerify = await verifyOtp(phoneNumber, otpCode)
    if (otpVerify.status == 'approved') {
        
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

          // Create User
        const user = await User.create({
        fullName,email,phoneNumber,
        password: hashedPassword
    })
    if(user) {  
        res.status(201).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            token: generateAuthToken(user._id)
        })
    }
    }else{
        res.status(400)
        throw new Error('Invalid OTP')
    }
    }catch (error) {
        res.status(408).send({message: "Internal Server Error"}) 
    }
})


const userLogin = asyncHandler(async (req,res) => {
    try{
    const { email , password } = req.body

    // Check for user email
    const user = await User.findOne({
        $and: [{email:email}, {isBlocked: false}] })
    // Check for user status
    if(user && user.isBlocked == false && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            token: generateAuthToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
    }catch (error) {
    res.status(500).send({message: "Internal Server Error"}) 
}
})

const getCars = asyncHandler(async (req,res) => {
    const cars = await Cars.find({isBlocked: false}).sort({createdAt: -1})
    if(cars) {
        res.status(200).json(cars)
    } else {
        res.status(400)
        throw new Error("Cars Not Getting")
    }
})

const getCar = asyncHandler(async (req,res) => {
    const car = await Cars.findById(req.query.id)
    if(car) {
        res.status(200).json(car)
    } else {
        res.status(400)
        throw new Error("Something Went Wrong!")
    }
})

const bookCar = asyncHandler(async (req,res) => {
    const { user, car, totalAmount, totalDays, pickUpDate, dropOffDate, dropOffCity, driverRequire } = req.body
    
   
    if(!user, !car, !totalAmount, !totalDays, !pickUpDate, !dropOffDate, !dropOffCity) {
        res.status(400)
        throw new Error("All Fields are Required")
    } else {
        const  theCar = await Cars.findById(car)
       
        let selectedFrom = moment(pickUpDate)
       
      
        let selectedTo = moment(dropOffDate)
    
    
        
        if(theCar.bookedSlots.length > 0) {
            for (let slot of theCar.bookedSlots) {
                if (selectedFrom.isBetween(moment(slot.from), moment(slot.to), null, '[)') || selectedTo.isBetween(moment(slot.from), moment(slot.to), null, '(]')) {
                    res.status(400)
                    throw new Error('Slot is Already Reserved')
                }
            }
        }
        theCar.bookedSlots.push({ from: pickUpDate, to: dropOffDate})
        await theCar.save()

        const bookCar = await Bookings.create({
            user, car, totalAmount, totalHours: totalDays, 'bookedSlots.from' : pickUpDate, 'bookedSlots.to': dropOffDate, dropoffCity: dropOffCity, driverRequire, transactionId: 'pending'
        })
        if (bookCar && theCar) {
            res.status(201).json(bookCar)
        } else {
            res.status(400)
            throw new Error('Something went wrong')
        }
    }
})


const myBookings = asyncHandler(async (req,res) => {
    const id = req.query.id
    if (!id) {
        res.status(400)
        throw new Error('User is Not Found')
    }
    const userBookings = await Bookings.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(id) }
        },
        {
            $lookup: {
                from: 'cars',
                localField: 'car',
                foreignField: '_id',
                as: 'carData'
            }
        },
        {
            $sort: { createdAt: -1 } 
        }
    ])
    res.json(userBookings)
})

const payment = asyncHandler(async (req,res) => {
    const { token, bookingId } = req.body

    const updateBookStatus = await Bookings.findByIdAndUpdate({_id: bookingId}, { transactionId: bookingId, status: 'booked', 'shippedAddress.name': token.card.name, 'shippingAddress.email': token.email, 'shippingAddress.address': token.card.address_line1, 'shippingAddress.city': token.card.address_city, 'shippingAddress.pincode': token.card.address_zip })
    if (updateBookStatus) {
        res.status(200).json({ message: "Booking Completed Successfully"})
    } else {
        res.status(400)
        throw new Error('Something Went Wrong')
    }
})




const generateAuthToken = (id) => {
    return jwt.sign({id},process.env.JWTPRIVATEKEY,{expiresIn:"10d"})
    }
 


module.exports={
    userSignup,
    otpVerification,
    userLogin,
    getCars,
    getCar,
    bookCar,
    myBookings,
    payment
}