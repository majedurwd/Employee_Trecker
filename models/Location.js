const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegisterUser",
    },
    lat: {
        type: String,
        default: 26.0289243,
        required: true,
    },
    long: {
        type: String,
        default: 88.4682187,
        required: true,
    },
    radius: {
        type: String,
        default: 200,
        required: true,

    },
});

const Location = model("Location", locationSchema);
module.exports = Location;
