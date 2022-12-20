const router = require("express").Router()

const adminControllers = require("../controllers/admin-controller")

router.get("/user", adminControllers.getAllUser)

module.exports = router