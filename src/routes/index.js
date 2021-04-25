const express = require("express");
const router = express.Router();
const users = require("./users");

module.exports = router.use("/api/v1/", users)
