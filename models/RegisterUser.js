const { Schema, model } = require("mongoose")

const registerSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    deviceId: {
        type: String,
        required: true,
        unique: false,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: Number,
    otpExpire: Date,
    forgetOtp: Number,
    forgetOtpExpire: Date,
    createdAt: Date,
    updatedAt: Date,
})


const RegisterUser = model("RegisterUser", registerSchema)

module.exports = RegisterUser