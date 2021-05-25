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
                                OFFSET @offset ROWS
                                FETCH NEXT @limit ROWS ONLY`;

            let request = DB.requestSQL(this.connection);

            request.input('limit', DB.number, limit);
            request.input('offset', DB.number, offset);

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
            let request = DB.requestSQL(this.connection);
            let result = await request.query(queryStatement);
            result = result.recordsets[0];
            if (result && result.length > 0) return result[0];
            return result;
        } catch (err) {
            throw CustomError.cannotGetEntity(`${this.table} Service`, this.table, err);
        }
    }

    queryStatementCreate(item) {
        try {
            let buildCommandColumn = [];
            let buildCommandValues = [];

            for (const [key] of Object.entries(item)) {
                // Mean: [column]
                buildCommandColumn.push(`[${key}]`);
                // Mean: @data
                buildCommandValues.push(`@${key}`);
            }
            return `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
                        INSERT INTO ${this.table} 
                        (${buildCommandColumn.join(",")}) 
                        VALUES (${buildCommandValues.join(",")});
                        SELECT SCOPE_IDENTITY() AS ${BaseModel.id}`;
        } catch (err) {
            throw err
        }
    }

    queryStatementUpdate(item, condition) {
        try {
            let buildCommand = [];
            for (const [key] of Object.entries(item)) {
                buildCommand.push(`[${key}] = @${key}`);
            }
            return `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
                    UPDATE ${this.table} 
                    SET ${buildCommand.join(",")} 
                    WHERE ${condition}`;
        } catch (err) {
            throw err
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
            let queryStatement = `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON
                                    INSERT INTO ${this.table}
                                    (${buildCommandColumn.join(",")})
                                    VALUES (${buildCommandValues.join(",")});
                                    SELECT SCOPE_IDENTITY() AS ${BaseModel.id}`;
            let result = await request.query(queryStatement);
            await transaction.commit();
            // Get ID inserted successfully and return
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
            await transaction.begin();
            const request = DB.requestSQL(transaction);
            let buildCommand = [];
            for (const [key, value] of Object.entries(item)) {
                if (value) {
                    let _value = value;
                    // Check value is json and not string
                    if (Utilities.isObject(value)) {
                        _value = JSON.stringify(value);
                    }
                    buildCommand.push(`[${key}] = '${_value}'`);
                } else {
                    buildCommand.push(`[${key}] = NULL`);
                }
            }
            let queryStatement = `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON
                                        UPDATE ${this.table}
                                        SET ${buildCommand.join(",")}
                                        WHERE ${BaseModel.id} = @id`;
            request.input('id', DB.number, id);
            await request.query(queryStatement);
            await transaction.commit();
            // Get ID updated successfully and return
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

    async deleteItem(id) {
        const transaction = DB.transactionSQL(this.connection)
        try {
            await transaction.begin();
            const request = DB.requestSQL(transaction);
            request.input('id', DB.number, id);
            let queryStatement = `DELETE ${this.table} WHERE ${BaseModel.id} = @id`;
            await request.query(queryStatement);
            await transaction.commit();
            return "success";
        }
        catch (err) {
            try {
                await transaction.rollback();
                throw CustomError.cannotDeleteEntity(`${this.table} Service`, this.table, err);
            } catch (errTrans) {
                throw CustomError.cannotDeleteEntity(`${this.table} Service`, this.table, err);
            }
        }
    }
}

module.exports = BaseService;