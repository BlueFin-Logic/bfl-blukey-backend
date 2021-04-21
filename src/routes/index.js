const express = require("express");
const router = express.Router();
const {listUser} = require("./users");
// import { router as users } from "./users";

// module.exports.routes = router.use("/api/v1/", users)

exports.routes = router.use("/api/v1/", listUser)
