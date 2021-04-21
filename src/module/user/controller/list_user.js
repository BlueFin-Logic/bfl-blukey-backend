const sql = require('mssql')

const config = {
    user: 'lamnguyen',
    password: 'Thanhnam0',
    server: 'bluefinlogic.database.windows.net',
    database: 'real-estate',
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

exports.listUser = async (req, res) => {
    try {
        let pool = await sql.connect(config)
        let result = await pool.request()
            .query('SELECT * FROM [User]')


        console.log(result);
        return res.send(result.recordsets)
    } catch (err) {
        console.log(err);
        return res.send(err)
    }
}