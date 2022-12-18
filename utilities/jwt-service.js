const jwt = require("jsonwebtoken")
const { JWT_SECRET, JWT_EXPIRE } = require("../config")

class JwtService {
    static sign(payload, expiry = JWT_EXPIRE , secret = JWT_SECRET) {
        return jwt.sign(payload, secret, { expiresIn: expiry })
    }
    static verify(payload, secret = JWT_SECRET) {
        return jwt.verify(payload, secret)
    }
}

module.exports = JwtService
