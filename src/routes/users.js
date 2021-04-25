const express = require("express");
const router = express.Router();
let {listUser} = require("../module/user/controller/list_user");
let {createUser} = require("../module/user/controller/create_user");


module.exports = router.get("/users", listUser)
module.exports = router.post("/users", createUser)

