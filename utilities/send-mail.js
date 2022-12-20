
const nodmailer = require("nodemailer")
const { SMTP_SERVICE, SMTP_HOST, SMTP_PORT } = require("../config")


const sendEmail = async (options) => {
    const transporter = nodmailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        service: SMTP_SERVICE,
        auth: {
            // Your Email
            user: "noreply.applyapp@gmail.com",
            // Your Password or App Password
            pass: "d i r h a h a p r h a s u y t p",
        },
    });

    const mailOptions = {
        from: SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail