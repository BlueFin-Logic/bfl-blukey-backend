const sql = require('mssql')
const config = require('./../../../config')

module.exports.listUser = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
            .query('SELECT * FROM [User]')

        console.log(result);
        return res.send(result.recordsets)
    } catch (err) {
        console.log(err);
        return res.send(err)
    }
}