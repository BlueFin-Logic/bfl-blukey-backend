const sql = require('mssql');
const config = require('../config');
const { Utilities } = require('../common/utilities');

class BaseRepository {
    constructor(table) {
        this.table = table;

        this.config = {
            server: config.sql.server,
            database: config.sql.database,
            user: config.sql.user,
            password: config.sql.password,
            encrypt: config.sql.options.encrypt,
            trustServerCertificate: config.sql.options.trustServerCertificate,
            port: 1433,
            parseJSON: true
        };

        this.connectString = `Server=tcp:${this.config.server},1433;Initial Catalog=${this.config.database};Persist Security Info=False;User ID=${this.config.user};Password=${this.config.password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`;
    }

    async getAll(page, limit) {
        try {
            let pool = await sql.connect(this.connectString);
            let offset = (page - 1) * limit;
            let result = await pool.request()
                .input('offset', sql.Int, offset)
                .input('limit', sql.Int, limit)
                .query(`SELECT *
                        FROM ${this.table}
                        ORDER BY id ASC
                        OFFSET @offset ROWS
                        FETCH NEXT @limit ROWS ONLY`);
            return result.recordsets[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getById(id) {
        try {
            let pool = await sql.connect(this.connectString);
            let result = await pool.request()
                .input('id', sql.Int, id)
                .query(`SELECT * FROM ${this.table} WHERE id = @id`);
            result = result.recordsets[0];
            if (result && result.length > 0) return result[0];
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async addItem(item) {
        let pool = await sql.connect(this.connectString);
        const transaction = new sql.Transaction(pool);
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
        let pool = await sql.connect(this.connectString);
        const transaction = new sql.Transaction(pool);
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
        let pool = await sql.connect(this.connectString);
        const transaction = new sql.Transaction(pool);
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
module.exports = BaseRepository;