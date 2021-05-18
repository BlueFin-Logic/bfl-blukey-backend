const express = require("express");
const app = express();
const config = require('../config');
const DB = require('../database/db')
const routes = require("../routes/index");
const responseErrorHandler = require("../response_error/response-error-handler.js");
const CustomError = require('../response_error/error');

// module.exports = function setupConnection(appContext) {
//     return async (req, res, next) => {
//         try {
//             let [pool] = await Promise.all([DB.connectDB(config.configMSSQL)]);
//             appContext.createPoolMSSQL = pool;
//             next();
//         } catch (err) {
//             if (err instanceof CustomError) next(err);
//             else next(CustomError.badRequest("Setup Connection", "Can not setup connection with services.", err));
//             // return next(err) because data before req just passing function, not router
//         }
//     }
// }

module.exports = async function setupConnection(appContext) {
    try {
        let [pool] = await Promise.all([DB.connectDB(config.configMSSQL)]);
        appContext.setPoolMSSQL = pool;

        // check connection
        // app.get("/test", (req, res) => {
        //     // req.query
        //     // res.status().json()
        //     res.send("pong");
        // });

        // body parse
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())

        // setup routes index
        app.use(routes(appContext));

        // handle response & error
        app.use(responseErrorHandler);

        // start the Express server
        app.listen(config.port, () => {
            console.log(`Server started at http://localhost:${config.port}`);
        });
    } catch (err) {
        if (err instanceof CustomError) console.log(err);
        console.log(CustomError.badRequest("Setup Connection", "Can not setup connection with services.", err));
        // return next(err) because data before req just passing function, not router
    }
}