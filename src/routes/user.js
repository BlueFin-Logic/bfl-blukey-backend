const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

module.exports = function setupRouterUser(appContext) {
    router.get("", userController.getAll(appContext));
    router.get("/:id", userController.getById(appContext));
    router.post("", userController.create(appContext));
    router.put("/:id", userController.update(appContext));
    router.delete("/:id", userController.delete(appContext));
    return router;
}

