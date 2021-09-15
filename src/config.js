'use strict';
const dotenv = require('dotenv');
dotenv.config();

// PORT
const PORT = process.env.PORT || "8080";
// DATABASE
const SQL_USER = process.env.SQL_USER;
const SQL_PASSWORD = process.env.SQL_PASSWORD;
const SQL_DATABASE = process.env.SQL_DATABASE;
const SQL_SERVER = process.env.SQL_SERVER;
// TOKEN
const ISSUER = process.env.ISSUER || "realestate";
const SUBJECT = process.env.SUBJECT || "nathan";
const AUDIENCE = process.env.AUDIENCE || "bluefinlogic";
const ALGORITHM = process.env.ALGORITHM || "HS256";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "mytokensecret";
const EXPIRES_IN = process.env.EXPIRES_IN || "1h";
// STORAGE
const STORAGE_NAME = process.env.STORAGE_NAME;
const STORAGE_KEY = process.env.STORAGE_KEY;
// EMAIL
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

module.exports = {
    port: PORT,
    database: {
        user: SQL_USER,
        password: SQL_PASSWORD,
        database: SQL_DATABASE,
        server: SQL_SERVER
    },
    tokenJWT: {
        issuer: ISSUER,
        subject: SUBJECT,
        audience: AUDIENCE,
        algorithm: ALGORITHM,
        token_secret: TOKEN_SECRET,
        expiresIn: EXPIRES_IN,
    },
    azureStorage: {
        storageName: STORAGE_NAME,
        storageKey: STORAGE_KEY,
        containerTransaction: "transdocs",
        containerUser: "userinfo"
    },
    email: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
};

// SQL_USER=lamnguyen
// SQL_PASSWORD=Thanhnam0
// SQL_DATABASE=blukeytest
// SQL_SERVER=bluefinlogic.database.windows.net

// SQL_USER=blukey
// SQL_PASSWORD=Nathan01
// SQL_DATABASE=BluKey-SQL
// SQL_SERVER=blukey-sql.database.windows.net

// # azure storage
// STORAGE_NAME = blukeystoragedev
// STORAGE_KEY = JFhI+odr/RgkEP2TNiwHzea6sY2K3olwVv61uKdZxaJKv15QpR8PDttXMFqXyzTFF1qoJdBarHUgbazXmDbdpA==

// STORAGE_NAME = blukeystorage
// STORAGE_KEY = OV35llHMViaiv90h8jwK4KVb8NxL7x8NkNccfKBtLR2Va6kCgmENCB2R+d7XXZxAxHldpgIJkP5SNZzukfOiGw==