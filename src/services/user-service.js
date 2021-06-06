const BaseService = require('./base-service');
const UserModel = require('../model/user');
const CustomError = require('../response_error/error');
const {Time} = require('../common/time');
const TABLE_USER = UserModel.tableName;

class UserService extends BaseService {
    constructor(db) {
        super(db, TABLE_USER);
    }

    async getByCondition(fields, condition, data) {
        try {
            let queryStatement = `SELECT ${fields}
                                FROM ${this.table}
                                WHERE ${condition}`;
            let request = this.db.requestSQL(this.db.pool);
            request.input('id', this.db.number, data.id);
            request.input('first_name', this.db.string, data.first_name);
            request.input('last_name', this.db.string, data.last_name);
            request.input('email', this.db.string, data.email);
            request.input('address', this.db.string, data.address);
            request.input('username', this.db.string, data.username);
            request.input('password', this.db.string, data.password);
            request.input('is_admin', this.db.boolean, data.is_admin);
            request.input('is_deleted', this.db.boolean, data.is_deleted);
            request.input('created_at', this.db.date, data.created_at);
            request.input('updated_at', this.db.date, data.updated_at);
            request.input('last_login_date', this.db.date, data.last_login_date);
            let result = await request.query(queryStatement);
            result = result.recordsets[0];
            // if (result && result.length > 0) return result[0];
            return result;
        } catch (err) {
            throw CustomError.cannotGetEntity(`${this.table} Service`, this.table, err);
        }
    }

    async addItem(item) {
        const transaction = this.db.transactionSQL(this.db.pool);
        try {
            let timeNow = Time.getLatestTime;
            item.updated_at = timeNow;
            item.created_at = timeNow;
            item.last_login_date = timeNow;
            const data = UserModel.cleanJsonCreate(item);

            await transaction.begin();
            const request = this.db.requestSQL(transaction);
            let queryStatement = this.queryStatementCreate(data);
            request.input('first_name', this.db.string, data.first_name);
            request.input('last_name', this.db.string, data.last_name);
            request.input('email', this.db.string, data.email);
            request.input('address', this.db.string, data.address);
            request.input('username', this.db.string, data.username);
            request.input('password', this.db.string, data.password);
            request.input('salt', this.db.string, data.salt);
            request.input('is_admin', this.db.boolean, data.is_admin);
            request.input('is_deleted', this.db.boolean, data.is_deleted);
            request.input('created_at', this.db.date, data.created_at);
            request.input('updated_at', this.db.date, data.updated_at);
            request.input('last_login_date', this.db.date, data.last_login_date);
            let result = await request.query(queryStatement);
            await transaction.commit();
            result = result.recordsets[0];
            return result[0]
        } catch (err) {
            try {
                await transaction.rollback();
                throw CustomError.cannotCreateEntity(`${this.table} Service`, this.table, err);
            } catch (errTrans) {
                throw CustomError.cannotCreateEntity(`${this.table} Service`, this.table, err);
            }
        }
    }

    async updateItem(id, item) {
        const transaction = this.db.transactionSQL(this.db.pool);
        try {
            let timeNow = Time.getLatestTime;
            item.updated_at = timeNow;
            item.created_at = null;
            item.last_login_date = item.last_login_date? timeNow : null;
            const data = UserModel.cleanJsonUpdate(item);

            await transaction.begin();
            const request = this.db.requestSQL(transaction);
            let queryStatement = this.queryStatementUpdate(data, `${UserModel.id} = @id`);
            request.input('id', this.db.number, id);
            request.input('first_name', this.db.string, data.first_name);
            request.input('last_name', this.db.string, data.last_name);
            request.input('email', this.db.string, data.email);
            request.input('address', this.db.string, data.address);
            request.input('username', this.db.string, data.username);
            request.input('password', this.db.string, data.password);
            request.input('salt', this.db.string, data.salt);
            request.input('is_admin', this.db.boolean, data.is_admin);
            request.input('is_deleted', this.db.boolean, data.is_deleted);
            request.input('updated_at', this.db.date, data.updated_at);
            request.input('last_login_date', this.db.date, data.last_login_date);
            await request.query(queryStatement);
            await transaction.commit();
            return {id: id};
        } catch (err) {
            try {
                await transaction.rollback();
                throw CustomError.cannotUpdateEntity(`${this.table} Service`, this.table, err);
            } catch (errTrans) {
                throw CustomError.cannotUpdateEntity(`${this.table} Service`, this.table, err);
            }
        }
    }

    // async ping(appContext) {
    //     try {
    //         // let request = await this.request();
    //         // let pool = await this.connectSQL(appContext.configMSSQL);
    //         let pool = appContext.poolMSSQL;
    //         let request1 = this.requestSQL(pool);
    //         let result1 = await request1.query(`SELECT *, (SELECT [Documents].[id], [Documents].[link]
    //                                                     FROM [Documents]
    //                                                     WHERE [Documents].[user_id] = [Users].[id]
    //                                                     FOR JSON PATH) AS docs
    //                                         FROM [Users]
    //                                         FOR JSON PATH, INCLUDE_NULL_VALUES`);
    //
    //         let request2 = this.requestSQL(pool);
    //         let result2 = await request2.query(`SELECT * FROM [Users] FOR JSON PATH, INCLUDE_NULL_VALUES`);
    //         return result1.recordsets[0][0];
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }
}

module.exports = UserService;