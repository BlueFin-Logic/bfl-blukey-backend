const BaseService = require('./base-service');
const { UserModel } = require('../model/table');
const TABLE_USER = UserModel.tableName

class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

    async ping() {
        try {
            let request = await this.request();
            let result1 = await request.query(`SELECT *, (SELECT [Documents].[id], [Documents].[link]
                                                        FROM [Documents]  
                                                        WHERE [Documents].[user_id] = [Users].[id]
                                                        FOR JSON PATH) AS docs
                                            FROM [Users]
                                            FOR JSON PATH, INCLUDE_NULL_VALUES`);

            let result2 = await request.query(`SELECT *FROM [Users] FOR JSON PATH, INCLUDE_NULL_VALUES`);
            return result1.recordsets[0][0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = UserService;