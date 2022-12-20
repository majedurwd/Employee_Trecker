const { Schema, model } = require("mongoose")

const userDetailsSchema = new Schema({
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
    createdAt: Date,
    updatedAt: Date,
});

const userDetails = model("UserDetails", userDetailsSchema)

module.exports = userDetails