const express = require("express");
const router = express.Router();
const documentTypeController = require("../controllers/documentType");

module.exports = function setupRouter(appContext) {
    router.get("", documentTypeController.getAll(appContext));
    router.get("/:id", documentTypeController.getById(appContext))
    router.get("/transactions/:transactionId", documentTypeController.getByCondition(appContext));
    router.post("", documentTypeController.create(appContext));
    router.put("/:id", documentTypeController.update(appContext));
    router.delete("/:id", documentTypeController.delete(appContext));
    return router;
}


