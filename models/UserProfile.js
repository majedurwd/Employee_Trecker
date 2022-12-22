const { Schema, model } = require("mongoose")


/**
 * userId
title
firstName
middleName
surName
phone
passportId
nationalId
address
createdAt
updatedAt
*/
const userProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegisterUser",
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
    passportId: {
        type: String,
        required: true,
    },
    nationalId: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    createAt: Date,
    updateAt: Date,
});

const UserProfile = model("UserProfile", userProfileSchema)
module.exports = UserProfile