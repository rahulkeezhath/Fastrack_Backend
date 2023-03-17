const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema ({
    car: { type: mongoose.Schema.Types.ObjectId, ref:'cars', required: [true, 'Car is Required'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: [true,  'UserId is Required']},
    bookedSlots: { from: { type:String }, to: { type: String }},
    dropoffCity: { type: String, required: [true, 'DropOff city is Required']},
    totalAmount: { type: String, required: [true, 'Total Amount is Required']},
    totalHours: { type: String, required: [true, 'Total Hours is Required']},
    driverRequire: { type: Boolean, required: [true, 'Driver Status is Required']},
    transactionId: { type: String, required: [true, 'Transaction Id is Required']},
    status: { type: String, default: 'pending'},
    shippingAddress: { name: { type: String }, email: { type: String }, address: { type:String}, city: { type: String}, pincode: { type: String }}
}, { timestamps: true})

module.exports = mongoose.model('Bookings', bookingSchema)