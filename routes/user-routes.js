const router = require("express").Router();

// Import Utili
const userControllers = require("../controllers/user-controller");
// Register Validators
const {
    registerUserValidator,
    registerUserValidationHandler,
} = require("../utilities/register-user-validator");

// User Details Validators
const {
    userDetailsValidator,
    userDetailsValidationHandler,
} = require("../utilities/user-details-validator");

// User Emergency Validators
const {
    userEmergencyValidator,
    userEmergencyValidationHandler,
} = require("../utilities/user-emergency-validator");

// Import User Authenticated Middleware
const { isAuthenticated, authorizeRoles, singleUserAuthenticate } = require("../middlewares/is-autenticated");

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
router.put("/resend/:userId", userControllers.resendVarifiactionOtp);

// Email Verification Route
router.post("/verify/:userId", userControllers.mailVerifiacation);

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
router.post("/login", userControllers.loginUser);

// User Update Details Route
router.patch(
    "/details/update/:userId",
    isAuthenticated,
    userControllers.userUpdateDetails
);

router.put("")

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

module.exports = router;
