const router = require('express').Router();
const {adminLogin,
    adminUsers,blockAndUnblockUser,
    getPlace,addPlace,deletePlace,
    getBrands,addBrand,deleteBrand,
    adminCars,addCars,deleteCar,editCar,adminBookings, adminDrivers, approveDriver, declineDriver, blockAndUnblockDriver, blockAndUnblockCar, changeStatus} 
    = require('../controllers/adminController');
const { adminProtect } = require('../middleware/authMiddleware');





// Login
router.post('/adminLogin',adminLogin)

// Users
router.get('/users',adminProtect, adminUsers)
router.put('/blockAndUnblockUser',adminProtect, blockAndUnblockUser)

// Places
router.get('/getPlaces', getPlace )
router.post('/addPlace',adminProtect,addPlace )
router.delete('/deletePlace',adminProtect,deletePlace )


// Brands
router.get('/getBrands',getBrands)
router.post('/addBrand',adminProtect,addBrand)
router.delete('/deleteBrand',adminProtect,deleteBrand)

// Car
router.get('/cars',adminProtect, adminCars)
router.post('/addCars',adminProtect,addCars)
router.delete('/deleteCar',adminProtect, deleteCar)
router.put('/editCar',adminProtect,editCar)
router.put('/blockAndUnblockCar', adminProtect, blockAndUnblockCar)

//Bookings
router.get('/getBookings',adminProtect,adminBookings)
router.put('/changeStatus',changeStatus)

// Drivers
router.get('/drivers',adminProtect,adminDrivers)
router.put('/approveDriver',adminProtect,approveDriver)
router.put('/declineDriver',adminProtect,declineDriver)
router.put('/blockAndUnblockDriver',adminProtect,blockAndUnblockDriver)

module.exports = router