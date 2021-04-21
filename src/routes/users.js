const express = require("express");
const router = express.Router();
let list_user = require("../module/user/controller/list_user");
let create_user = require("../module/user/controller/create_user");


exports.listUser = router.get("/users", list_user.listUser)
exports.createUser = router.post("/users", create_user.createUser)
// router.post("/users", createUser)
