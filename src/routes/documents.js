const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document-controller");

module.exports = function setupRouter(appContext) {
    router.get("/", documentController.getByUserID(appContext));
    return router;
}


