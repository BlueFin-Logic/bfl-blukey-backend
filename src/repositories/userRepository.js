const sql = require('mssql');
const BaseRepository = require('./baseRepository');
const { UserModel } = require('../model/table');
const TABLE_USER = UserModel.tableName

class UserRepository extends BaseRepository {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

    async ping() {
        try {
            let request = await this.request();
            let result = await request.query(`SELECT *, (SELECT [Documents].[id], [Documents].[link]
                                                        FROM [Documents]  
                                                        WHERE [Documents].[user_id] = [Users].[id]
                                                        FOR JSON PATH) AS docs
                                            FROM [Users]
                                            FOR JSON PATH, INCLUDE_NULL_VALUES`);
            return result.recordsets[0][0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = UserRepository;