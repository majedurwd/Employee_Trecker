const router = require("express").Router();

router.get("/", (_req, res) => {
    res.status(200).json({ message: "ok" });
});

module.exports = router;
