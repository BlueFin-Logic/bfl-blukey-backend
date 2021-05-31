const BaseService = require('./base-service');
const DocumentModel = require('../model/document');
const CustomError = require('../response_error/error');
const {Time} = require('../common/time');
const TABLE_DOCUMENTS = DocumentModel.tableName;

class DocumentService extends BaseService {
    constructor(db) {
        super(db, TABLE_DOCUMENTS);
    }

    async getByCondition(fields, condition, data) {
        try {
            let queryStatement = `SELECT ${fields}
                                FROM ${this.table}
                                WHERE ${condition}`;
            let request = this.db.requestSQL(this.db.pool);
            request.input('id', this.db.number, data.id);
            request.input('container', this.db.string, data.container);
            request.input('file_name', this.db.string, data.file_name);
            request.input('user_id', this.db.number, data.user_id);
            request.input('is_deleted', this.db.boolean, data.is_deleted);
            request.input('created_at', this.db.date, data.created_at);
            request.input('updated_at', this.db.date, data.updated_at);
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
            item.updated_at = Time.getLatestTime;
            item.created_at = Time.getLatestTime;
            const data = DocumentModel.cleanJsonCreate(item);

            await transaction.begin();
            const request = this.db.requestSQL(transaction);
            let queryStatement = this.queryStatementCreate(data);
            request.input('container', this.db.string, data.container);
            request.input('file_name', this.db.string, data.file_name);
            request.input('user_id', this.db.number, data.user_id);
            request.input('is_deleted', this.db.boolean, data.is_deleted);
            request.input('created_at', this.db.date, data.created_at);
            request.input('updated_at', this.db.date, data.updated_at);
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
}

module.exports = DocumentService;