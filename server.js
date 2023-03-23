const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors')
const connectDB = require('./config/db')
const colors = require('colors')
const bodyParser = require("body-parser");


const userRoutes = require('./routes/userRouter')
const adminRoutes = require('./routes/adminRouter')
const driverRoutes = require('./routes/driverRouter')
const { errorHandler } = require('./middleware/errorMiddleware')

// Database Connection
connectDB(()=>{
    try{
        console.log("Database Successfully Connected");
    } catch (error) {
        console.log("Database Not Connected: ", error);
    }
})

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/api/users',userRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/driver',driverRoutes)

app.use(errorHandler)



app.listen(port, () =>
console.log(`Server Started on port ${port}`.yellow.bold));
