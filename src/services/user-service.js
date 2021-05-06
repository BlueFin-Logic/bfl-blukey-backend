const BaseService = require('./base-service');
const { UserModel } = require('../model/table');
const TABLE_USER = UserModel.tableName
const sql = require('mssql');
class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

    async ping(appContext) {
        try {
            // let request = await this.request();
            // let pool = await this.connectSQL(appContext.configMSSQL);
            let pool = appContext.poolMSSQL;
            let request1 = this.requestSQL(pool);
            let result1 = await request1.query(`SELECT *, (SELECT [Documents].[id], [Documents].[link]
                                                        FROM [Documents]  
                                                        WHERE [Documents].[user_id] = [Users].[id]
                                                        FOR JSON PATH) AS docs
                                            FROM [Users]
                                            FOR JSON PATH, INCLUDE_NULL_VALUES`);

            let request2 = this.requestSQL(pool);
            let result2 = await request2.query(`SELECT *FROM [Users] FOR JSON PATH, INCLUDE_NULL_VALUES`);
            return result1.recordsets[0][0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = UserService;