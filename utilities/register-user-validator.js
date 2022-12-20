const { check, validationResult } = require("express-validator");
const RegisterUser = require("../models/RegisterUser")

const registerUserValidator = [
    check("email", "Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .notEmpty()
        .withMessage("Email is required")
        .custom( async (value) => {
            const useEmail = await RegisterUser.findOne({ email: value })
            if(useEmail) throw new Error("This email already exist")
        })
        .trim(),
    check("password", "Password is required")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("password must be minimum 6 length")
        .withMessage("White space not allowed"),
    check("deviceId", "Device Id is required")
        .notEmpty()
        .withMessage("Device Id is required")
        .trim(),
];

const registerUserValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) return next();

    res.status(406).json({
        success: false,
        mappedErrors,
    });
};

module.exports = {
    registerUserValidator,
    registerUserValidationHandler,
};
