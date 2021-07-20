const express = require("express");
const router = express.Router();
const users = require("./user");
const authenController = require("../controllers/authen");
const uploadController = require("../controllers/upload");
const middlewareAuthorize = require("../middleware/authorize");
const middlewareUpload = require("../middleware/upload");
const documentUser = require("./documentUser");
const transaction = require("./transaction");
const documentType = require("./documentType");
const transactionDocumentTypeController = require("../controllers/transactionDocumentType");

module.exports = function setupRouter(appContext) {
    // login
    router.post("/api/v1/login", authenController.login(appContext));
    // upload
    router.post("/api/v1/uploadDocumentUser", [middlewareAuthorize.authorize(appContext), middlewareUpload.validateUpload(appContext)], uploadController.uploadDocumentUser(appContext));
    router.post("/api/v1/uploadTransactionDocumentType", [middlewareAuthorize.authorize(appContext), middlewareUpload.validateUpload(appContext)], uploadController.uploadTransactionDocumentType(appContext));
    router.delete("/api/v1/uploadTransactionDocumentType", middlewareAuthorize.authorize(appContext), transactionDocumentTypeController.delete(appContext));
    // user
    router.use("/api/v1/users", middlewareAuthorize.authorize(appContext), users(appContext));
    // documentUser
    router.use("/api/v1/documentUsers", middlewareAuthorize.authorize(appContext), documentUser(appContext));
    // transaction
    router.use("/api/v1/transactions", middlewareAuthorize.authorize(appContext), transaction(appContext));
    // documentType
    router.use("/api/v1/documentTypes", middlewareAuthorize.authorize(appContext), documentType(appContext));
    return router;
}
