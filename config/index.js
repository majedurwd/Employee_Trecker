
const dotenv = require("dotenv")

dotenv.config()

module.exports = {
    APP_PORT,
    DB_URI,
    SMTP_SERVICE,
    SMTP_MAIL,
    SMTP_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
    JWT_SECRET,
    JWT_EXPIRE,
} = process.env;