const express = require("express");
const router = express.Router();
const users = require("./user");
const authenController = require("../controllers/authen");
const uploadController = require("../controllers/upload");
const documentUserController = require("../controllers/documentUser");
const transactionDocumentTypeController = require("../controllers/transactionDocumentType");
const middlewareAuthorize = require("../middleware/authorize");
const middlewareUpload = require("../middleware/upload");
const documentUser = require("./documentUser");
const transaction = require("./transaction");
const transactionComment = require("./transactionComment");
const documentType = require("./documentType");

module.exports = function setupRouter(appContext) {
    // reset password
    router.post("/api/v1/resetPassword", authenController.resetPassword(appContext));
    // login
    router.post("/api/v1/login", authenController.login(appContext));
    // logout
    router.post("/api/v1/logout", middlewareAuthorize.authorize(appContext), authenController.logout(appContext));
    // upload document user
    router.post("/api/v1/uploadDocumentUser", [middlewareAuthorize.authorize(appContext), middlewareUpload.validateUpload(appContext)], uploadController.uploadDocumentUser(appContext));
    // upload document transaction
    router.post("/api/v1/uploadTransactionDocumentType", [middlewareAuthorize.authorize(appContext), middlewareUpload.validateUpload(appContext)], uploadController.uploadTransactionDocumentType(appContext));
    // delete document user
    router.delete("/api/v1/uploadDocumentUser/:id", middlewareAuthorize.authorize(appContext), documentUserController.delete(appContext));
    // delete document transaction
    router.delete("/api/v1/uploadTransactionDocumentType", middlewareAuthorize.authorize(appContext), transactionDocumentTypeController.delete(appContext));
    // user
    router.use("/api/v1/users", middlewareAuthorize.authorize(appContext), users(appContext));
    // documentUser
    router.use("/api/v1/documentUsers", middlewareAuthorize.authorize(appContext), documentUser(appContext));
    // transaction
    router.use("/api/v1/transactions", middlewareAuthorize.authorize(appContext), transaction(appContext));
    // transactionComment
    router.use("/api/v1/transactionComments", middlewareAuthorize.authorize(appContext), transactionComment(appContext));
    // documentType
    router.use("/api/v1/documentTypes", middlewareAuthorize.authorize(appContext), documentType(appContext));
    return router;
}
