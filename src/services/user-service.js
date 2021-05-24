const BaseService = require('./base-service');
const UserModel = require('../model/user');
const CustomError = require('../response_error/error');
const {Time} = require('../common/time');
const DB = require('../database/db');
const TABLE_USER = UserModel.tableName

const sql = require('mssql');

class UserService extends BaseService {
    constructor(connection) {
        super(connection, TABLE_USER);
    }

    async addItem(item) {
        const transaction = DB.transactionSQL(this.connection)
        try {
            item.updated_at = Time.getLatestTime;
            item.created_at = Time.getLatestTime;
            item.last_login_date = Time.getLatestTime;
            const data = UserModel.cleanJsonCreate(item);

            await transaction.begin();
            const request = DB.requestSQL(transaction);
            let queryStatement = this.queryStatementCreate(data);
            request.input('first_name', DB.string, data.first_name);
            request.input('last_name', DB.string, data.last_name);
            request.input('email', DB.string, data.email);
            request.input('address', DB.string, data.address);
            request.input('username', DB.string, data.username);
            request.input('password', DB.string, data.password);
            request.input('salt', DB.string, data.salt);
            request.input('is_admin', DB.boolean, data.is_admin);
            request.input('is_deleted', DB.boolean, data.is_deleted);
            request.input('created_at', DB.date, data.created_at);
            request.input('updated_at', DB.date, data.updated_at);
            request.input('last_login_date', DB.date, data.last_login_date);
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
        const transaction = DB.transactionSQL(this.connection)
        try {
            item.updated_at = Time.getLatestTime;
            item.created_at = null;
            item.last_login_date = item.last_login_date? Time.getLatestTime : null;
            const data = UserModel.cleanJsonUpdate(item);

            await transaction.begin();
            const request = DB.requestSQL(transaction);
            let queryStatement = this.queryStatementUpdate(data, `${UserModel.id} = @id`);
            request.input('id', DB.number, id);
            request.input('first_name', DB.string, data.first_name);
            request.input('last_name', DB.string, data.last_name);
            request.input('email', DB.string, data.email);
            request.input('address', DB.string, data.address);
            request.input('username', DB.string, data.username);
            request.input('password', DB.string, data.password);
            request.input('salt', DB.string, data.salt);
            request.input('is_admin', DB.boolean, data.is_admin);
            request.input('is_deleted', DB.boolean, data.is_deleted);
            request.input('updated_at', DB.date, data.updated_at);
            request.input('last_login_date', DB.date, data.last_login_date);
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