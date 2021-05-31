const sql = require('mssql');

class DB {
    constructor(config) {
        this.config = config;
        this.pool = null;
    }

    connectDB(config) {
        try {
            return sql.connect(config);
        } catch (err) {
            throw err;
        }
    }

    requestSQL(pool) {
        try {
            return new sql.Request(pool);
        } catch (err) {
            throw err;
        }
    }

    transactionSQL(pool) {
        try {
            return new sql.Transaction(pool);
        } catch (err) {
            throw err;
        }
    }

    get number() {
        try {
            return sql.Int;
        } catch (err) {
            throw err;
        }
    }

    get string() {
        try {
            return sql.NVarChar;
        } catch (err) {
            throw err;
        }
    }

    get boolean() {
        try {
            return sql.Bit;
        } catch (err) {
            throw err;
        }
    }

    get date() {
        try {
            return sql.DateTime;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = DB