const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

// router.get("/ping", userController.ping)

router.get("", userController.list)
router.get("/:id", userController.getByID)
router.post("", userController.create)
router.put("/:id", userController.update)
router.delete("/:id", userController.delete)
// router
//     .route("")
//     .get(userListController)
//     .post(userCreateController);

module.exports = router;


