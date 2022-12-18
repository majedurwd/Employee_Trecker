
class customErrorMsg extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }

    static notFound(message, statusCode = 404) {
        return new customErrorMsg(message, statusCode)
    }

    static notAccept(message, statusCode = 406) {
        return new customErrorMsg(message, statusCode)
    }

    static unAuthorized(message, statusCode = 401) {
        return new customErrorMsg(message, statusCode)
    }

}

module.exports = customErrorMsg