const express = require("express");
const router = express.Router();
const users = require("./users");
const { authorizeController } = require("../middleware/authorize");
const { authenLoginController } = require("../controller/authen");

module.exports = router.post("/api/v1/login", authenLoginController)

module.exports = router.use("/api/v1/users", authorizeController, users)
