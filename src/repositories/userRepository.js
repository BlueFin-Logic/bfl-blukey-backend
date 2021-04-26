const sql = require('mssql');
const BaseRepository = require('./baseRepository');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');

class UserRepository extends BaseRepository {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

    async getAll(page, limit) {
        try {
            let result = await super.getAll(page, limit);
            return Utilities.responsePaging(result, Utilities.parseInt(page, 0), Utilities.parseInt(result.length, 0));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getByEmail(data) {
        try {
            let pool = await sql.connect(this.connectString);
            let result = await pool.request()
                .input('email', sql.NVarChar, data)
                .query(`SELECT id, email, password, salt, is_admin FROM ${this.table} WHERE email = @email`);
            result = result.recordsets[0];
            if (result && result.length > 0) return result[0];
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

module.exports = UserRepository;