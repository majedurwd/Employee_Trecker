const { Schema, model } = require("mongoose")

const emergencySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegisterUser"
    },
    title: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    surName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    relation: {
        type: String,
        required: true
    }
})

const UserEmergency = model("UserEmergency", emergencySchema)
module.exports = UserEmergency