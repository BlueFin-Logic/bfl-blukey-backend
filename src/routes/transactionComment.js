const express = require("express");
const router = express.Router();
const transactionCommentController = require("../controllers/transactionComment");

module.exports = function setupRouterUser(appContext) {
    router.get("", transactionCommentController.getByCondition(appContext));
    router.post("", transactionCommentController.create(appContext));
    router.put("/:id", transactionCommentController.update(appContext));
    router.delete("/:id", transactionCommentController.delete(appContext));
    return router;
}

