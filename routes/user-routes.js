const router = require("express").Router();

// Import Utili
const userControllers = require("../controllers/user-controller");
// Register Validators
const {
    registerUserValidator,
    registerUserValidationHandler,
} = require("../utilities/register-user-validator");

// User Profile Validators
const {
    userProfileValidator,
    userProfileValidationHandler
} = require("../utilities/user-profile-validator")

// User Emergency Validators
const {
    userEmergencyValidator,
    userEmergencyValidationHandler,
} = require("../utilities/user-emergency-validator");

// Import User Authenticated Middleware
const {
    isAuthenticated,
    singleUserAuthenticate
} = require("../middlewares/is-autenticated");

/**
 * Setup Controllers
*/
// Register Route
router.post(
    "/register",
    registerUserValidator,
    registerUserValidationHandler,
    userControllers.registerUser
);
// Resend Verification Route
router.put("/resend/:userId", userControllers.resendVarifiactionOtp);

// Email Verification Route
router.post("/verify/:userId", userControllers.mailVerifiacation);

// User Details Route
router.post(
    "/details/:userId",
    userProfileValidator,
    userProfileValidationHandler,
    userControllers.userProfile
)

// User Emergency contact Route
router.post(
    "/emergency/:userId",
    userEmergencyValidator,
    userEmergencyValidationHandler,
    userControllers.userEmergency
);

// Login Route
router.post("/login", userControllers.loginUser);

// User Update Details Route
router.patch(
    "/details/update/:userId",
    isAuthenticated,
    userControllers.userUpdateDetails
)

// User Update Emergency Contact Route
router.patch(
    "/emergency/update/:userId",
    isAuthenticated,
    userControllers.updateEmergencyContact
);

// User Delete Route
router.delete("/delete/:userId", userControllers.deleteUser);

// Get Single User Route
router.get("/singleUser", singleUserAuthenticate, userControllers.getSingleUser)

// Forget Password OTP Sender Route
router.post("/send/forgetOtp", userControllers.forgetPassowrdOtpSender)

// Forget Password OTP Checker Route
router.post("/check/forgetOtp/:userId", userControllers.forgetPasswordOtpChecker)

// Forget Password
router.post("/forget/:userId", userControllers.changePassword)

router.patch("/update/geofance",isAuthenticated, userControllers.updateGeofence)

module.exports = router;
