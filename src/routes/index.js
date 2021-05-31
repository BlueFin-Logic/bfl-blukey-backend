const express = require("express");
const router = express.Router();
const users = require("./users");
const documents = require("./documents");
const userController = require("../controllers/user-controller");
const authenController = require("../controllers/authen-controller");
const uploadController = require("../controllers/upload-controller");
const middlewareAuthorize = require("../middleware/authorize");
const middlewareupload = require("../middleware/upload");

module.exports = function setupRouter(appContext) {
    // register
    router.post("/api/v1/register", userController.registerUser(appContext));
    // login
    router.post("/api/v1/login", authenController.login(appContext));
    // info
    router.get("/api/v1/info", middlewareAuthorize.authorizedMiddleware(appContext), userController.getUserInfo(appContext));
    // upload
    router.post("/api/v1/upload", middlewareAuthorize.authorizedMiddleware(appContext), middlewareupload.validateUploadMiddleware(appContext), uploadController.upload(appContext));
    // user
    router.use("/api/v1/users", middlewareAuthorize.authorizedMiddleware(appContext), users(appContext));
    // router.use("/api/v1/users", users(appContext));
    // document
    router.use("/api/v1/documents", middlewareAuthorize.authorizedMiddleware(appContext), documents(appContext));
    // ping
    // router.get("/api/v1/ping", userController.pingUser(appContext));
    return router;
}

// module.exports = router.get("/api/v1/ping", userController.pingUser)
