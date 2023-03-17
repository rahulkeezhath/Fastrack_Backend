const mongooose = require('mongoose')

const connectDB = async () => {
    try{
        const connection = await mongooose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDb Successfully Connected : ${connection.connection.host}`.cyan.underline);
        
    }catch (error){
        console.log(`Error:${error.message}`.red.bold);
        process.exit(1)
    }
}

module.exports = connectDB