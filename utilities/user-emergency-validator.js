
const { check, validationResult } = require("express-validator")

const userEmergencyValidator = [
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
    check("phone", "Telephone number is required")
        .notEmpty()
        .withMessage("Telephone number is required")
        .trim(),
    check("relation", "Relation status is required")
        .isString()
        .notEmpty()
        .withMessage("Relation status is required")
        .trim()
]

const userEmergencyValidationHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()
    if (Object.keys(mappedErrors).length === 0) return next()

    res.status(406).json({
        success: false,
        mappedErrors,
    })
}

module.exports = {
    userEmergencyValidator,
    userEmergencyValidationHandler
}