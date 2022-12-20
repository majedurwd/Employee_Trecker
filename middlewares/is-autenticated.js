
const JwtService = require("../utilities/jwt-service")
const { JWT_SECRET } = require("../config")
const UserDetails = require("../models/UserDetails")
const customErrorMsg = require("../utilities/custom-error-msg")
const RegisterUser = require("../models/RegisterUser")

const isAuthenticated = async(req, _res, next) => {
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

const authorizeRoles = (...role) => {
    return (req, _res, next) => {
        if (!role.includes(req.user.roles)) {
            return next(
                customErrorMsg.unAuthorized(
                    `Role: ${req.user.roles} is not allowed to access this resource`
                )
            )
        }
        next()
    }
}

const singleUserAuthenticate = async (req, res, next) => { 
    try {
        let token = req.headers.authorization;

        if (!token) return next(customErrorMsg.unAuthorized("Unauthorized"));
        token = token.split(" ")[1];
        const decoded = JwtService.verify(token, JWT_SECRET);
        console.log(decoded)
        const user = await RegisterUser.findOne({ _id: decoded.id });
        if (!user) return next(customErrorMsg.unAuthorized("Unauthorized"));

        req.user = user;
        req.token = token
        next();
    } catch (err) {
        next(err);
    }
}


module.exports = {
    isAuthenticated,
    authorizeRoles,
    singleUserAuthenticate,
}