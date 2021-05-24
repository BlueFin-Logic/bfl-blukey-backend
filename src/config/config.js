'use strict';

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const HOST_URL = process.env.HOST_URL;
const SQL_USER = process.env.SQL_USER;
const SQL_PASSWORD = process.env.SQL_PASSWORD;
const SQL_DATABASE = process.env.SQL_DATABASE;
const SQL_SERVER = process.env.SQL_SERVER;
const ISSUER = process.env.ISSUER;
const SUBJECT = process.env.SUBJECT;
const AUDIENCE = process.env.AUDIENCE;
const ALGORITHM = process.env.ALGORITHM;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";
const SQL_TRUST_SERVER_CERTIFICATE = process.env.SQL_TRUST_SERVER_CERTIFICATE === "true";


module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    configMSSQL: {
        user: SQL_USER,
        password: SQL_PASSWORD,
        server: SQL_SERVER,
        database: SQL_DATABASE,
        connectionTimeout: 15000,
        parseJSON: true,
        options: {
            encrypt: SQL_ENCRYPT, // for azure
            trustServerCertificate: SQL_TRUST_SERVER_CERTIFICATE, // change to true for local dev / self-signed certs
            enableArithAbort: true
        }
    },
    tokenJWT: {
        issuer: ISSUER,
        subject: SUBJECT,
        audience: AUDIENCE,
        algorithm: ALGORITHM,
        token_secret: TOKEN_SECRET,
        expiresIn: EXPIRES_IN,
    },
};

// SQL_USER=lamnguyen
// SQL_PASSWORD=Thanhnam0
// SQL_DATABASE=blukey
// SQL_SERVER=bluefinlogic.database.windows.net
// SQL_ENCRYPT=true
// SQL_TRUST_SERVER_CERTIFICATE=true

// #sql server config
// SQL_USER=blukey
// SQL_PASSWORD=Nathan01
// SQL_DATABASE=BluKey-SQL
// SQL_SERVER=blukey-sql.database.windows.net
// SQL_ENCRYPT=true
// SQL_TRUST_SERVER_CERTIFICATE=true