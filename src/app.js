const appContext = require("./common/app-context");
const express = require("express");
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const config = require('./config');
const responseErrorMiddleware = require("./middleware/res-err");
const CustomError = require('./common/error');
const routes = require("./routes");
const Sequelize = require('./database/sequelize');
const AzureStorageService = require('./common/azure-storage');
const TokenService = require('./common/token');

module.exports = async () => {
    try {
        // DB
        const {models, sequelize} = Sequelize(config.database);
        // Create azure storage
        const storage = new AzureStorageService(config.azureStorage.storageName, config.azureStorage.storageKey);
        // Check connect to DB, Azure Storage
        await Promise.all([
            sequelize.authenticate(),
            storage.listFirstContainers()
        ]);
        // Create DB
        // await sequelize.sync({alfter: true});
        // await sequelize.sync({force: true});

        // Set model to DB App Context
        appContext.setDB = models;
        // Set storage to App Context
        appContext.setStorage = storage;
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
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
        // setup routes index
        app.use(routes(appContext));
        // handle response & error
        app.use(responseErrorMiddleware);
        // Start express server
        app.listen(config.port, () => {
            console.log(`Server started at http://localhost:${config.port}`);
        });
    } catch (err) {
        if (err instanceof CustomError.CustomError) console.log(err);
        console.log(CustomError.badRequest("Setup Connection", "Can not setup connection with services.", err));
        // return next(err) because data before req just passing function, not router
    }
}