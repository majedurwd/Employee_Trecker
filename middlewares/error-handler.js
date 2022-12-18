// Import Internal
const customErrorMsg = require("../utilities/custom-error-msg")

const errorHandler = (err, req, res, next) => {
    let msg = err.message || "Internal Server Error"
    let statusCode = err.statusCode || 500

    if (err instanceof customErrorMsg) {
        msg = err.message
        statusCode = err.statusCode
    }

    return res.status(statusCode).json({success: false, msg: msg })
}

module.exports = errorHandler
