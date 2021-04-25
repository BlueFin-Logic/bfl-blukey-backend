const sql = require('mssql')
const config = require('./../../../config')

module.exports.createUser = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
        .input('first_name', sql.VarChar, req.body.first_name)
        .input('last_name', sql.VarChar, req.body.last_name)
        .input('address', sql.VarChar, req.body.address)
        .input('username', sql.VarChar, req.body.username)
        .input('password', sql.VarChar, req.body.password)
        .input('is_admin', sql.Bit, req.body.is_admin)
        .input('is_deleted', sql.Bit, req.body.is_deleted)
        .query('INSERT INTO [User] ([first_name], [last_name], [address], [username], [password], [is_admin], [is_deleted]) VALUES (@first_name, @last_name, @address, @username, @password, @is_admin, @is_deleted)')

        console.log(result);
        return res.send(result.recordsets)
    } catch (err) {
        console.log(err);
        return res.send(err)
    }
}