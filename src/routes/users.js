const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

module.exports = function setupRouter(appContext) {
    router.get("", userController.listUser(appContext));
    router.get("/:id", userController.getByIdUser(appContext));
    router.post("", userController.createUser(appContext));
    router.put("/:id", userController.updateUser(appContext));
    router.delete("/:id", userController.deleteUser(appContext));
    return router;
}


