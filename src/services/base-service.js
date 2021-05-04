const sql = require('mssql');
const config = require('../config');
const { Utilities } = require('../common/utilities');
const { BaseModel } = require('../model/table');

class BaseService {
    constructor(table) {
        this.table = table;

        // this.config = {
        //     server: config.sql.server,
        //     database: config.sql.database,
        //     user: config.sql.user,
        //     password: config.sql.password,
        //     port: 1433,
        //     encrypt: config.sql.options.encrypt,
        //     // trustServerCertificate: config.sql.options.trustServerCertificate,
        //     // parseJSON: true
        // };

        // this.connectString = `Server=tcp:${this.config.server},1433;Initial Catalog=${this.config.database};Persist Security Info=False;User ID=${this.config.user};Password=${this.config.password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`;

        this.connectString = {
            user: config.sql.user,
            password: config.sql.password,
            server: config.sql.server,
            database: config.sql.database,
            connectionTimeout: 15000,
            parseJSON: true,
            options: {
                encrypt: config.sql.options.encrypt, // for azure
                trustServerCertificate: config.sql.options.trustServerCertificate // change to true for local dev / self-signed certs
            }
        }
    }

    // async connectionPool() {
    //     try {
    //         const pool = new sql.ConnectionPool(this.connectString);
    //         await pool.connect();
    //         return pool;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }

    async connect() {
        try {
            return await sql.connect(this.connectString);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async request() {
        try {
            let pool = await this.connect();
            return new sql.Request(pool);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async transaction() {
        try {
            let pool = await this.connect();
            return new sql.Transaction(pool);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getAll(page, limit, fields) {
        try {
            let queryStatement = `SELECT ${fields}
                                FROM ${this.table}
                                ORDER BY ${BaseModel.column_updated_at} DESC
                                OFFSET @offset ROWS
                                FETCH NEXT @limit ROWS ONLY`;
            let offset = (page - 1) * limit;
            let request = await this.request();
            request.input('offset', sql.Int, offset)
            request.input('limit', sql.Int, limit)
            let result = await request.query(queryStatement);
            return result.recordsets[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getByCondition(fields, condition) {
        try {
            let queryStatement = `SELECT ${fields}
                                FROM ${this.table}
                                WHERE ${condition}`;
            let request = await this.request();
            let result = await request.query(queryStatement);
            result = result.recordsets[0];
            if (result && result.length > 0) return result[0];
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async addItem(item) {
        const transaction = await this.transaction();
        try {
            await transaction.begin();
            const request = new sql.Request(transaction);
            let builCommandColumn = [];
            let builCommandValues = [];

            for (const [key, value] of Object.entries(item)) {
                if (value !== null) {
                    let _value = value;
                    // Check value is json and not string
                    if (Utilities.isObject(value)) {
                        _value = JSON.stringify(value);
                    }
                    // Mean: [column]
                    builCommandColumn.push(`[${key}]`);
                    // Mean: 'data'
                    builCommandValues.push(`'${_value}'`);
                }
            }
            //add this config "SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON" to avoid "The identifier that starts with...is too long. Maximum length is 128."
            // QUOTED_IDENTIFIER ON: "column" == [column]
            // QUOTED_IDENTIFIER OFF: "column" == 'column'
            // ANSI_NULLS ON: ColumnValue IS NULL, can not using =, <>, etc.
            let queryStatement = `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON INSERT INTO ${this.table} (${builCommandColumn.join(",")}) VALUES (${builCommandValues.join(",")}); SELECT SCOPE_IDENTITY() AS id`;
            let result = await request.query(queryStatement);
            await transaction.commit();
            // Get ID inserted successfully and return
            result = result.recordsets[0];
            return {
                "result": result[0],
                "message": "Data is inserted successfully!"
            }
        }
        catch (err) {
            await transaction.rollback();
            console.log(err);
            return {
                "result": {},
                "message": err.message
            }
        }
    }

    async updateItem(id, item) {
        const transaction = await this.transaction();
        try {
            await transaction.begin();
            const req = new sql.Request(transaction);
            req.input('id', sql.Int, id);
            let builCommand = [];
            for (const [key, value] of Object.entries(item)) {
                if (value !== null) {
                    let _value = value;
                    // Check value is json and not string
                    if (Utilities.isObject(value)) {
                        _value = JSON.stringify(value);
                    }
                    builCommand.push(`[${key}] = '${_value}'`);
                }
                else {
                    builCommand.push(`[${key}] = NULL`);
                }
            }
            let queryStatement = `SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON UPDATE ${this.table} SET ${builCommand.join(",")} WHERE id = @id`;
            let result = await req.query(queryStatement);
            await transaction.commit();
            // Get ID updated successfully and return
            result = result.recordsets[0];
            return {
                "result": { id: Utilities.parseInt(id, 0) },
                "message": "Data is updated successfully!"
            }
        }
        catch (err) {
            await transaction.rollback();
            console.log(err);

            return {
                "result": {},
                "message": err.message
            }
        }
    }

    async deleteItem(id) {
        // let pool = await this.connect();
        // const transaction = new sql.Transaction(pool);
        const transaction = await this.transaction();
        try {
            await transaction.begin();
            const req = new sql.Request(transaction);
            req.input('id', sql.Int, id);
            let queryStatement = `DELETE ${this.table} WHERE id = @id`;
            let result = await req.query(queryStatement);
            await transaction.commit();
            return {
                "result": "success",
                "message": "Data is deleted successfully!"
            }
        }
        catch (err) {
            await transaction.rollback();
            console.log(err);

            return {
                "result": "fail",
                "message": err.message
            }
        }
    }
}
module.exports = BaseService;