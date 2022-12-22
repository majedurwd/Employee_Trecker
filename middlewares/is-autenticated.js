
const JwtService = require("../utilities/jwt-service")
const { JWT_SECRET } = require("../config")
const customErrorMsg = require("../utilities/custom-error-msg")
const RegisterUser = require("../models/RegisterUser")

const isAuthenticated = async(req, _res, next) => {
    try {
        let token = req.headers.authorization
        if (!token)
            return next(customErrorMsg.unAuthorized("Unauthorized"))
        token = token.split(" ")[1]
        const decoded = JwtService.verify(token, JWT_SECRET)
        const user = await RegisterUser.findOne({ _id: decoded.id })
        if (!user)
            return next(customErrorMsg.unAuthorized("Unauthorized"))
        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}

const authorizeRoles = async (req, _res, next) => {
    const authorized = await RegisterUser.findById(req.user.id);

    if (!authorized.roles.includes("ADMINISTRATOR")) {
        return next(customErrorMsg.unAuthorized("Authoraization faild!"));
    }
    next()
}

const singleUserAuthenticate = async (req, res, next) => { 
    try {
        let token = req.headers.authorization;

        if (!token) return next(customErrorMsg.unAuthorized("Unauthorized"));
        token = token.split(" ")[1];
        const decoded = JwtService.verify(token, JWT_SECRET);

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