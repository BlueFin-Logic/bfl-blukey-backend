const express = require("express");
const router = express.Router();
const users = require("./users");
const userController = require("../controllers/user-controller");
const authenController = require("../controllers/authen-controller");
const middlewareController = require("../middleware/authorize");

// register
module.exports = router.post("/api/v1/register", userController.register)
// login
module.exports = router.post("/api/v1/login", authenController.login)
// user
module.exports = router.use("/api/v1/users", middlewareController.authorize, users)

// register
module.exports = router.get("/api/v1/ping", userController.ping)
