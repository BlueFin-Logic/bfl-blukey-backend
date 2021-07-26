const express = require("express");
const router = express.Router();
const documentTypeController = require("../controllers/documentType");

module.exports = function setupRouter(appContext) {
    router.get("", documentTypeController.getByCondition(appContext));
    return router;
}


