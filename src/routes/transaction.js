const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");

module.exports = function setupRouterTransaction(appContext) {
    router.get("", transactionController.getAll(appContext));
    router.get("/:id", transactionController.getById(appContext));
    router.post("", transactionController.create(appContext));
    router.put("/:id", transactionController.update(appContext));
    return router;
}

