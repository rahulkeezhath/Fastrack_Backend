const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {User} = require('../models/userModel')
const {Admin} = require('../models/adminModel')


const protect = asyncHandler(async (req, res, next ) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //  Get Token from header
      token = req.headers.authorization.split(' ')[1]
      
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)

     
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not AUthorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})



const adminProtect = asyncHandler(async (req, res, next ) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //  Get Token from header
      token = req.headers.authorization.split(' ')[1]


      // Verify Token
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)


      req.admin = await Admin.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not AUthorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})



module.exports = { protect, adminProtect }