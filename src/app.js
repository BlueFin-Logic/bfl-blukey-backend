const AppContext = require("./common/app-context");
const express = require("express");
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const CONFIG = require('./config');
const responseErrorMiddleware = require("./middleware/res-err");
const MyError = require('./common/error');
const routes = require("./routes");
const Sequelize = require('./database/sequelize');
const AzureStorageService = require('./common/azure-storage');
const TokenService = require('./common/token');
const EmailService = require('./common/email');
const LoggingDbService = require('./repositories/loggingDb');
const SessionService = require('./repositories/session');
const LoggerFile = require('./helper/winstonLogger').configWinston('/app.js')

module.exports = async () => {
    try {
        // DB
        const {models, sequelize} = Sequelize(CONFIG.database);
        // Create azure storage
        const storage = new AzureStorageService(CONFIG.azureStorage.storageName, CONFIG.azureStorage.storageKey);
        // Check connect to DB, Azure Storage
        await Promise.all([
            sequelize.authenticate(),
            storage.listFirstContainers()
        ]);
        // Create DB
        // await sequelize.sync({alfter: true});
        // await sequelize.sync({force: true});

        // App Context
        const appContext = new AppContext(
            models,
            sequelize,
            new TokenService(
                CONFIG.tokenJWT.token_secret,
                {
                    issuer: CONFIG.tokenJWT.issuer,
                    subject: CONFIG.tokenJWT.subject,
                    audience: CONFIG.tokenJWT.audience,
                    algorithm: CONFIG.tokenJWT.algorithm,
                    expiresIn: CONFIG.tokenJWT.expiresIn
                }
            ),
            storage, // STORAGE
            new EmailService(CONFIG.email.user, CONFIG.email.pass), // EMAIL
            new LoggingDbService(models), // LOGINGDB
            new SessionService(models) // SESSION
        );
        // CORS
        app.use(cors());
        app.use(helmet());
        // check connection
        app.get("/ping", (req, res) => {
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
        app.listen(CONFIG.port, () => {
            console.log(`Server started at http://localhost:${CONFIG.port}`);
            // LoggerFile.info(`Server started at http://localhost:${CONFIG.port}`, {value: {data: JSON.stringify(appContext)}});
        });
    } catch (err) {
        if (err instanceof MyError.MyError) console.log(err);
        console.log(MyError.badRequest("Setup Connection", "Can not setup connection with services.", err));
        // if (err instanceof MyError.MyError) LoggerFile.error(err);
        // LoggerFile.error("Can not setup connection with services.", {value: {data: JSON.stringify(MyError.badRequest("Setup Connection", "Can not setup connection with services.", err))}})
        // next(something) just pass 'data' before 'req' from mid to mid, not pass through to router.
    }
}