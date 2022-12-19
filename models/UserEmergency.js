const { Schema, model } = require("mongoose")

/**
 * Title(String)
 * First name(String)
 * Middle name(string)
 * Sur name(string)
 * Telephone(String)
 * Relation(String)
*/

const emergencySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegisterUser"
    },
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15,
    },
    middleName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15,
    },
    surName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
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