const express = require("express");
const router = express.Router();
const users = require("./users");
const userController = require("../controllers/user-controller");
const authenController = require("../controllers/authen-controller");
const middlewareController = require("../middleware/authorize");

module.exports = function setupRouter(appContext) {
    // register
    router.post("/api/v1/register", userController.registerUser(appContext))
    // login
    router.post("/api/v1/login", authenController.login(appContext))
    // user
    // router.use("/api/v1/users", middlewareController.authorize, users(appContext))
    router.use("/api/v1/users", users(appContext))
    // register
    // router.get("/api/v1/ping", userController.pingUser(appContext))
    return router;
}


// module.exports = router.get("/api/v1/ping", userController.pingUser)