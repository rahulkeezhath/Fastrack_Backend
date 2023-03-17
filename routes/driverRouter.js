const router = require('express').Router();
const { driverLogin, driverRegister } = require('../controllers/driverController');


router.post('/signup',driverRegister)
router.post('/login',driverLogin)

module.exports = router