
const JwtService = require("../utilities/jwt-service")
const { JWT_SECRET } = require("../config")
const UserDetails = require("../models/UserDetails")
const customErrorMsg = require("../utilities/custom-error-msg")

const isAuthenticated = async(req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token)
            return next(customErrorMsg.unAuthorized("Unauthorized"))
        token = token.split(" ")[1]
        const decoded = JwtService.verify(token, JWT_SECRET)
        const user = await UserDetails.findOne({ userId: decoded.id })
        if (!user)
            return next(customErrorMsg.unAuthorized("Unauthorized"))

        req.user = user
        next()
        console.log("All is well")
    } catch (err) {
        next(err)
    }
}

module.exports = {
    isAuthenticated,
}