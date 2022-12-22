const { Schema, model } = require("mongoose")

const userEmergencyContactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
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
    },
    createAt: Date,
    updateAt: Date,
})

const UserEmergencyContact = model("UserEmergencyContact", userEmergencyContactSchema)
module.exports = UserEmergencyContact