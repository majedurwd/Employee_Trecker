const router = require("express").Router()

const userRoutes = require("./user-routes")
const adminRoutes = require("./admin-routes")

router.get("/", (_req, res) => {
    res.status(200).json({ message: "/ working correctly" })
});

// User Router
router.use("/api/user", userRoutes)

// Admin Router
router.use("/api/admin", adminRoutes)

router.use("/health", require("./health"))

module.exports = router
