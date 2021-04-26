const express = require("express");
const router = express.Router();
const { userListController, userGetByIdController, userCreateController, userUpdateController, userDeleteController, userPingController } = require("../controller/user");

module.exports = router.get("/ping", userPingController)

module.exports = router.get("", userListController)
module.exports = router.get("/:id", userGetByIdController)
module.exports = router.post("", userCreateController)
module.exports = router.put("/:id", userUpdateController)
module.exports = router.delete("/:id", userDeleteController)


