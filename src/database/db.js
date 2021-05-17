const sql = require('mssql');

class DB {
    async createPoolMSSQL(){
        try {
            let [pool] = await Promise.all([DB.connectDB(config.configMSSQL)]);
            appContext.createPoolMSSQL = pool;
            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.badRequest("Setup Connection", "Can not setup connection with services.", err));
            // return next(err) because data before req just passing function, not router
        }
    }
    
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
}

module.exports = DB