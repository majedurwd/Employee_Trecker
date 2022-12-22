const { check, validationResult } = require("express-validator")

const userProfileValidator = [
    check("title", "Title is required")
        .isString()
        .notEmpty()
        .withMessage("Title is required")
        .trim(),
    check("firstName", "First name is required")
        .isString()
        .notEmpty()
        .withMessage("First name is required")
        .trim(),
    check("middleName", "Middle name is required")
        .isString()
        .notEmpty()
        .withMessage("Middle name is required")
        .trim(),
    check("surName", "Sur name is required")
        .isString()
        .notEmpty()
        .withMessage("Sur name is required")
        .trim(),
    check("phone", "Phone is required")
        .isString()
        .notEmpty()
        .withMessage("Phone is required")
        .trim(),
    check("passportId", "Passport Id is required")
        .isString()
        .notEmpty()
        .withMessage("Passport Id is required")
        .trim(),
    check("nationalId", "National Id is required")
        .isString()
        .notEmpty()
        .withMessage("National Id is required")
        .trim(),
    check("address", "Address is required")
        .isString()
        .notEmpty()
        .withMessage("Address is required")
        .trim(),
];

const userProfileValidationHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()
    if (Object.keys(mappedErrors).length === 0) return next()

    res.status(406).json({
        success: false,
        mappedErrors,
    })
};

module.exports = {
    userProfileValidator,
    userProfileValidationHandler
}