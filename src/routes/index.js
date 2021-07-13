const express = require("express");
const router = express.Router();
const users = require("./user");
const authenController = require("../controllers/authen");
const uploadController = require("../controllers/upload");
const middlewareAuthorize = require("../middleware/authorize");
const middlewareUpload = require("../middleware/upload");
const documentUser = require("./documentUser");
const transaction = require("./transaction");

module.exports = function setupRouter(appContext) {
    // login
    router.post("/api/v1/login", authenController.login(appContext));
    // upload
    router.post("/api/v1/uploadDocumentUser", [middlewareAuthorize.authorize(appContext), middlewareUpload.validateUpload(appContext)], uploadController.uploadDocumentUser(appContext));
    // user
    router.use("/api/v1/users", middlewareAuthorize.authorize(appContext), users(appContext));
    // documentUser
    router.use("/api/v1/documentUsers", middlewareAuthorize.authorize(appContext), documentUser(appContext));
    // transaction
    // router.use("/api/v1/transactions", middlewareAuthorize.authorize(appContext), transaction(appContext));
    return router;
}
