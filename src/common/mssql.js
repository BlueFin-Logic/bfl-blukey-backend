const sql = require('mssql');

module.exports.connectDB = function connectDB(configMSSQL) {
    try {
        return sql.connect(configMSSQL);
    } catch (err) {
        console.error(err);
        throw err;
    }
}