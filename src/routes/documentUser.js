const express = require("express");
const router = express.Router();
const documentUserController = require("../controllers/documentUser");

module.exports = function setupRouter(appContext) {
    router.get("/", documentUserController.getByCondition(appContext));
    return router;
}


