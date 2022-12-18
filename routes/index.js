const router = require("express").Router();

const userRoutes = require("./user-routes");

router.get("/", (req, res) => {
    res.status(200).json({ message: "/ working correctly" });
});

router.use("/api/user", userRoutes);

router.use("/health", require("./health"));

module.exports = router;
