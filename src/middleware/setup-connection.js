const config = require('../config');
const DB = require('../database/db')
const CustomError = require('../response_error/error');

const express = require("express");
const app = express();
// const config = require('../config');
const routes = require("../routes/index");
const responseErrorHandler = require("../response_error/response-error-handler.js");

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
        // let [pool] = await Promise.all([DB.connectDB(config.configMSSQL)]);
        let pool = await DB.connectDB(config.configMSSQL);
        appContext.setPoolMSSQL = pool;

        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        // setup routes index
        app.use(routes(appContext));

        // handle response & error
        app.use(responseErrorHandler);

        app.listen(config.port, () => {
            console.log(`server started at http://localhost:${config.port}`);
        });
    } catch (err) {
        if (err instanceof CustomError) console.log(err);
        console.log(CustomError.badRequest("Setup Connection", "Can not setup connection with services.", err));
        // return next(err) because data before req just passing function, not router
    }
}