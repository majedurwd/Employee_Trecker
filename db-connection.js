
const mongoose = require("mongoose")

function connectDB(DB_URI) {
    mongoose.set("strictQuery", false)
    return mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 1000,
    })
    
}

module.exports = connectDB
