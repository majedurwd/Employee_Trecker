const router = require("express").Router()

const adminControllers = require("../controllers/admin-controller")

const { isAuthenticated, authorizeRoles } = require("../middlewares/is-autenticated")


router.post("/login", adminControllers.loginAdmin)

router.get(
    "/user",
    isAuthenticated,
    authorizeRoles,
    adminControllers.getAllUser
);

router.get(
    "/singleUser/:userId",
    isAuthenticated,
    authorizeRoles,
    adminControllers.getSingleUser
)

router.put("/update/location/:userId",
    isAuthenticated,
    authorizeRoles,
    adminControllers.updateLocation
)

router.patch("/update/profile/:userId",
    isAuthenticated,
    authorizeRoles,
    adminControllers.updateUserProfileByAdmin
)

router.patch("/update/emergency/:userId",
    isAuthenticated,
    authorizeRoles,
    adminControllers.updateUserEmergencyByAdmin,
)

module.exports = router