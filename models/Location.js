const { Schema, model } = require("mongoose")

const locationSchema = new Schema({
    location: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "RegisterUser"
            },
            lat: {
                type: String,
                required: true
            },
            long: {
                type: String,
                required: true
            },
            radius: {
                type: String,
                required: true
            }

        }
    ]
})


const Location = model("Location", locationSchema)
module.exports = Location