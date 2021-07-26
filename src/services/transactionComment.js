const BaseService = require('./base');
const CustomError = require('../common/error');

class TransactionCommentService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getByTransactionId(transactionId) {
        try {
            if (!this.currentUser.isAdmin) {
                const transaction = await this.repository.getTransactionInfo(transactionId, this.currentUser.id);
                if (!transaction) throw CustomError.badRequest(`${this.tableName} Handler`, "User is not belong to transaction!")
            }
            const result = await this.repository.getByCondition({transactionId: transactionId});
            return result;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data) {
        try {
            if (!this.currentUser.isAdmin) {
                const transaction = await this.repository.getTransactionInfo(data.transactionId, this.currentUser.id);
                if (!transaction) throw CustomError.badRequest(`${this.tableName} Handler`, "User is not belong to transaction!")
            }

            data.userId = this.currentUser.id;
            const result = await this.repository.addItem(data);
            return {
                id: result.id
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async update(transCommentId, data) {
        try {
            const conditions = {
                id: transCommentId,
                userId: this.currentUser.id
            };
            let transCommentExist = await this.repository.getOne(conditions);
            if (!transCommentExist) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction comment is not belong to you!");

            const result = await this.repository.updateItem(data, conditions);
            return {
                rowEffects: result.length
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async delete(transCommentId) {
        try {
            const conditions = {
                id: transCommentId,
                userId: this.currentUser.id
            };
            let transCommentExist = await this.repository.getOne(conditions);
            if (!transCommentExist) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction comment is not belong to you!");

            await this.repository.deleteItem(conditions);
            return {
                id: transCommentId
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotDeleteEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = TransactionCommentService