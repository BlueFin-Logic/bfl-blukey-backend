const BaseService = require('./base');
const MyError = require('../common/error');

class TransactionCommentService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getByTransactionId(transactionId) {
        try {
            if (!this.currentUser.isAdmin) {
                const transaction = await this.repository.getTransactionInfo(transactionId, this.currentUser.id);
                if (!transaction) throw MyError.badRequest(`${this.tableName} Service`, "User is not belong to transaction!")
            }
            const result = await this.repository.getByCondition({transactionId: transactionId});
            return result;
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data, loggingDb) {
        try {
            if (!this.currentUser.isAdmin) {
                const transaction = await this.repository.getTransactionInfo(data.transactionId, this.currentUser.id);
                if (!transaction) throw MyError.badRequest(`${this.tableName} Service`, "User is not belong to transaction!")
            }
            data.userId = this.currentUser.id;
            // Create
            const result = await this.repository.addItem(data);
            // Loging DB Create
            loggingDb.addItem(this.currentUser.id, this.tableName, result);
            return {
                id: result.id
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async update(transCommentId, data, loggingDb) {
        try {
            const conditions = {
                id: transCommentId,
                userId: this.currentUser.id
            };
            const transCommentExist = await this.repository.getOne(conditions);
            if (!transCommentExist) throw MyError.badRequest(`${this.tableName} Service`, "Transaction comment is not belong to you!");
            // Update
            const result = await this.repository.updateItem(data, conditions);
            // Get data updated
            const updated = await this.repository.getOne(conditions);
            // Loging DB Update
            loggingDb.updateItem(this.currentUser.id, this.tableName, transCommentExist, updated);

            return {
                rowEffects: result.length
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(transCommentId, loggingDb) {
        try {
            const conditions = {
                id: transCommentId,
                userId: this.currentUser.id
            };
            const transCommentExist = await this.repository.getOne(conditions);
            if (!transCommentExist) throw MyError.badRequest(`${this.tableName} Service`, "Transaction comment is not found or is not belong to you!");

            // Soft delete
            await this.repository.deleteItem(conditions);
            // Get data updated
            const updated = await this.repository.getOne(conditions, null, null, false);
            // Loging DB Soft Delete
            loggingDb.deleteSoftItem(this.currentUser.id, this.tableName, transCommentExist, { 'deletedAt': updated.deletedAt });

            return {
                id: transCommentId
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = TransactionCommentService