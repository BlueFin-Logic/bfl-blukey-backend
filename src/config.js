'use strict';

const dotenv = require('dotenv');

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    SQL_USER,
    SQL_PASSWORD,
    SQL_DATABASE,
    SQL_SERVER
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === "true";
const sqlTrustServerCertificate = process.env.SQL_TRUST_SERVER_CERTIFICATE === "true";


module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    sql: {
        user: SQL_USER,
        password: SQL_PASSWORD,
        server: SQL_SERVER,
        database: SQL_DATABASE,
        options: {
            encrypt: sqlEncrypt,
            trustServerCertificate: sqlTrustServerCertificate
        },
    },
};