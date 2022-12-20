const UserDetails = require("../models/UserDetails")
const UserEmergency = require("../models/UserEmergency")

const getAllUser = async (req, res, next) => {
    try {
        const userPerPage = 5
        const countUser = await UserDetails.countDocuments()
        const users = await UserDetails.find()

        console.log(countUser)

    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllUser
}
