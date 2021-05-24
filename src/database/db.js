const sql = require('mssql');

class DB {
    static connectDB(configMSSQL) {
        try {
            return sql.connect(configMSSQL);
        } catch (err) {
            throw err;
        }
    }

    static requestSQL(pool) {
        try {
            return new sql.Request(pool);
        } catch (err) {
            throw err;
        }
    }

    static transactionSQL(pool) {
        try {
            return new sql.Transaction(pool);
        } catch (err) {
            throw err;
        }
    }

    static get number() {
        try {
            return sql.Int;
        } catch (err) {
            throw err;
        }
    }

    static get string() {
        try {
            return sql.NVarChar;
        } catch (err) {
            throw err;
        }
    }

    static get boolean() {
        try {
            return sql.Bit;
        } catch (err) {
            throw err;
        }
    }

    static get date() {
        try {
            return sql.DateTime;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = DB