const config = require('../config');
const mssql = require('../common/mssql')

module.exports = function setupConnection(appContext) {
    return async (req, res, next) => {
        try {
            let pool = await mssql.connectDB(config.configMSSQL);
            appContext.createAppContext(pool);
            next();
        } catch (err) {
            console.log(err);
            return res.status(400).json(err)
            // return next(err) because data before req just passing function, not router
        }
    }
}