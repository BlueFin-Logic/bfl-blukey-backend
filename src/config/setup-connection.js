const express = require("express");
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const config = require('./config');
const DB = require('../database/db')
const routes = require("../routes");
const responseErrorHandler = require("../response_error/response-error-handler.js");
const CustomError = require('../response_error/error');
const TokenService = require('../common/token');

module.exports = async function setupConnection(appContext) {
    try {
        // Connect DB
        const db = new DB(config.configMSSQL);
        let [pool] = await Promise.all([db.connectDB(db.config)]);
        db.pool = pool;
        appContext.setDB = db;

        // Get setting token config
        const token = config.tokenJWT.token_secret;
        const options = {
            issuer: config.tokenJWT.issuer,
            subject: config.tokenJWT.subject,
            audience: config.tokenJWT.audience,
            algorithm: config.tokenJWT.algorithm,
            expiresIn: config.tokenJWT.expiresIn
        };
        appContext.setTokenJWT = new TokenService(token, options);

        // CORS
        app.use(cors());
        app.use(helmet());

        // check connection
        app.get("/test", (req, res) => {
            res.send("pong");
        });

        // body parse
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

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
        // if (err instanceof CustomError) next(err);
        // else next(CustomError.badRequest("Setup Connection", "Can not setup connection with services.", err));
        // return next(err) because data before req just passing function, not router
    }
}