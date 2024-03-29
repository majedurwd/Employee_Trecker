const { Schema, model } = require("mongoose")

const registerSchema = new Schema({
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
        unique: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: [String],
        enum: ["USER", "MANAGER", "ADMINISTRATOR"],
        default: ["USER"],
    },
    active: {
        type: Boolean,
        default: true,
    },
    geofence: {
        type: String,
        enum: ["IN_AREA", "NOT_IN_AREA", "NOT_RESPONDING"],
        default: "NOT_RESPONDING",
    },
    otp: Number,
    otpExpire: Date,
    forgetOtp: Number,
    forgetOtpExpire: Date,
    forgetVerify: {
        type: Boolean,
        default: false,
    },
    createdAt: Date,
    updatedAt: Date,
});


const RegisterUser = model("RegisterUser", registerSchema)

module.exports = RegisterUser