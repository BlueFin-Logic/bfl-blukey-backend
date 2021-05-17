const express = require("express");
const app = express();
const config = require('./config');
const routes = require("./routes/index");
const responseErrorHandler = require("./response_error/response-error-handler.js");
const AppContext = require("./common/appContext");
const setupConnection = require("./middleware/setup-connection");


// body parse
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// check connection
// app.get("/ping", (req, res) => {
//     // req.query
//     // res.status().json()
//     res.send("pong");
// });

// const appContext = new AppContext(config.configMSSQL, config.tokenJWT);

let appContext = new AppContext();

appContext = setupConnection(appContext);
// // setup routes index
// app.use(routes(appContext));

// // handle response & error
// app.use(responseErrorHandler);

// setup connection
// app.use(setupConnection(appContext))

// // setup routes index
// app.use(routes(appContext))

// // handle response & error
// app.use(responseErrorHandler);

// start the Express server
// app.listen(config.port, () => {
//     console.log(`server started at http://localhost:${config.port}`);
// });