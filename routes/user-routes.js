const router = require("express").Router()

const userControllers = require("../controllers/user-controller")
// Register Validators
const {
    registerUserValidator,
    registerUserValidationHandler,
} = require("../utilities/register-user-validator")

// User Details Validators
const {
    userDetailsValidator,
    userDetailsValidationHandler,
} = require("../utilities/user-details-validator")

// User Emergency Validators
const {
    userEmergencyValidator,
    userEmergencyValidationHandler,
} = require("../utilities/user-emergency-validator")

// Import User Authenticated Middleware
const { isAuthenticated } = require("../middlewares/is-autenticated")

// Register Route
router.post(
    "/register",
    registerUserValidator,
    registerUserValidationHandler,
    userControllers.registerUser
);

router.post("/resister", (req, res) => {
    res.status(200).json(req.body);
});

// Resend Verification Route
router.put("/resend/:userId", userControllers.resendVarifiactionOtp)

// Email Verification Route
router.post("/verify/:userId", userControllers.mailVerifiacation)

// User Details Route
router.post(
    "/details/:userId",
    userDetailsValidator,
    userDetailsValidationHandler,
    userControllers.userDetails
);

// User Emergency contact Route
router.post(
    "/emergency/:userId",
    userEmergencyValidator,
    userEmergencyValidationHandler,
    userControllers.userEmergency
);

// Login Route
router.post("/login/:userId", userControllers.loginUser)

// User Update Details Route
router.patch(
    "/details/update/:userId",
    isAuthenticated,
    userControllers.userUpdateDetails
);

// User Update Emergency Contact Route
router.patch(
    "/emergency/update/:userId",
    isAuthenticated,
    userControllers.updateEmergencyContact
);

module.exports = router;
