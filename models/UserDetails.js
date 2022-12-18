const { Schema, model } = require("mongoose")

const userDetailsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegisterUser",
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    deviceId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 2,
    },
    middleName: {
        type: String,
        required: true,
        minLength: 2,
    },
    surName: {
        type: String,
        required: true,
        minLength: 2,
    },
    phone: {
        type: String,
        required: true
    },
    passportId: {
        type: String,
        required: true
    },
    nationalId: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    createdAt: Date,
    updatedAt: Date,

})

const userDetails = model("UserDetails", userDetailsSchema)

module.exports = userDetails