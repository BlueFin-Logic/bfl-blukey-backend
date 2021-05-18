const DB = require('../database/db');
const BaseModel = require('../model/base');
const CustomError = require('../response_error/error');
const {Utilities} = require('../common/utilities');

class BaseService {
    constructor(connection, table) {
        this.connection = connection;
        this.table = table;
    }

    async getAll(page, limit, fields, conditions = null) {
        try {
            if (page < 1) page = 1;
            if (limit < 1) limit = 1;
            if (limit > 100) limit = 100;
            let offset = (page - 1) * limit;
            if (conditions) conditions = `WHERE ${conditions}`;
            else conditions = "";

            let queryStatement = `SELECT ${fields}
                                FROM ${this.table}
                                ${conditions}
                                ORDER BY ${BaseModel.updated_at} DESC
                                OFFSET ${offset} ROWS
                                FETCH NEXT ${limit} ROWS ONLY`;
            
            let request = DB.requestSQL(this.connection)
            // let request = DB.requestSQL(null)
            // request.input('offset', sql.Int, offset)
            // request.input('limit', sql.Int, limit)
            let result = await request.query(queryStatement);
            return result.recordsets[0];
        } catch (err) {
            throw CustomError.cannotListEntity(`${this.table} Service`, this.table, err);
        }
    }

    async getByCondition(fields, condition) {
        try {
            let queryStatement = `SELECT ${fields}
                                FROM ${this.table}
                                WHERE ${condition}`;
            let request = DB.requestSQL(this.connection)
            let result = await request.query(queryStatement);
            result = result.recordsets[0];
            if (result && result.length > 0) return result[0];
            return result;
        } catch (err) {
            throw CustomError.cannotGetEntity(`${this.table} Service`, this.table, err);
        }
    }

    async addItem(item) {
        const transaction = DB.transactionSQL(this.connection)
        try {
            await transaction.begin();
            const request = DB.requestSQL(transaction);
            let buildCommandColumn = [];
            let buildCommandValues = [];

            for (const [key, value] of Object.entries(item)) {
                if (value !== null) {
                    let _value = value;
                    // Check value is json and not string
                    if (Utilities.isObject(value)) {
                        _value = JSON.stringify(value);
                    }
                    // Mean: [column]
                    buildCommandColumn.push(`[${key}]`);
                    // Mean: 'data'
                    buildCommandValues.push(`'${_value}'`);
                }
            }
            //add this config "SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON" to avoid "The identifier that starts with...is too long. Maximum length is 128."
            // QUOTED_IDENTIFIER ON: "column" == [column]
            // QUOTED_IDENTIFIER OFF: "column" == 'column'
            // ANSI_NULLS ON: ColumnValue IS NULL, can not using =, <>, etc.
            let queryStatement = `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON INSERT INTO ${this.table} 
                                    (${buildCommandColumn.join(",")}) 
                                    VALUES (${buildCommandValues.join(",")}); SELECT SCOPE_IDENTITY() AS ${BaseModel.id}`;
            let result = await request.query(queryStatement);
            await transaction.commit();
            // Get ID inserted successfully and return
            result = result.recordsets[0];
            return result[0]
        } catch (err) {
            return transaction.rollback()
                .then(value => {
                    throw CustomError.cannotCreateEntity(`${this.table} Service`, this.table, err);
                })
                .catch(reason => {
                    throw CustomError.cannotCreateEntity(`${this.table} Service`, this.table, err);
                });
        }
    }

    async updateItem(id, item) {
        const transaction = DB.transactionSQL(this.connection)
        try {
            await transaction.begin();
            const req = DB.requestSQL(transaction);
            let buildCommand = [];
            // request.input('offset', sql.Int, offset)
            for (const [key, value] of Object.entries(item)) {
                if (value) {
                    let _value = value;
                    // Check value is json and not string
                    if (Utilities.isObject(value)) {
                        _value = JSON.stringify(value);
                    }
                    buildCommand.push(`[${key}] = '${_value}'`);
                }
                // else {
                //     buildCommand.push(`[${key}] = NULL`);
                // }
            }
            let queryStatement = `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON UPDATE ${this.table} 
                                    SET ${buildCommand.join(",")} 
                                    WHERE ${BaseModel.id} = ${id}`;
            let result = await req.query(queryStatement);
            await transaction.commit();
            // Get ID updated successfully and return
            result = result.recordsets[0];
            return result;
        } catch (err) {
            return transaction.rollback()
                .then(value => {
                    throw CustomError.cannotUpdateEntity(`${this.table} Service`, this.table, err);
                })
                .catch(reason => {
                    throw CustomError.cannotUpdateEntity(`${this.table} Service`, this.table, err);
                });
        }
    }

    // async deleteItem(id) {
    //     // let pool = await this.connect();
    //     // const transaction = new sql.Transaction(pool);
    //     const transaction = await this.transaction();
    //     try {
    //         await transaction.begin();
    //         const req = new sql.Request(transaction);
    //         req.input('id', sql.Int, id);
    //         let queryStatement = `DELETE ${this.table} WHERE id = @id`;
    //         let result = await req.query(queryStatement);
    //         await transaction.commit();
    //         return {
    //             "result": "success",
    //             "message": "Data is deleted successfully!"
    //         }
    //     }
    //     catch (err) {
    //         await transaction.rollback();
    //         console.log(err);

    //         return {
    //             "result": "fail",
    //             "message": err.message
    //         }
    //     }
    // }
}

module.exports = BaseService;