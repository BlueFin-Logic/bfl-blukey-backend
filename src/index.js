const express = require("express");
const app = express();
const config = require('./config');
const routes = require("./routes/index");
const errorHandler = require("./error/errorHandler.js");

// body parse
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// check connection
app.get("/ping", (req, res) => {
    // req.query
    // res.status().json()
    res.send("pong");
});

// user routes index
app.use(routes)

// handle error
app.use(errorHandler);

// start the Express server
app.listen(config.port, () => {
    console.log(`server started at http://localhost:${config.port}`);
});