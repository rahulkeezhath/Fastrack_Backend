const router = require('express').Router();
const {userSignup, userLogin, otpVerification,getCars, getCar, bookCar, myBookings, payment} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');







//  Login&Signup
router.post('/userSignup',userSignup)
router.post('/userLogin',userLogin)

// OTP
router.post('/otp',otpVerification)

// User Details
// router.get('/getUser/:data_id', getUserDetails)
// router.put('/updateUser',updateUserProfile)

// Get Car
router.get('/cars', getCars)
router.get('/car', getCar)

// Booking Car
router.post('/bookCar',protect, bookCar)
router.get('/myBookings',protect, myBookings)

// Payment 
router.post('/payment',protect, payment)








module.exports = router;