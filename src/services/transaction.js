const BaseService = require('./base');
const CustomError = require('../common/error');
const {Op} = require('sequelize');

class TransactionService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async getAll(page, limit) {
        try {
            const include = [
                {
                    model: this.repository.models.User,
                    as: "user",
                    attributes: ["firstName", "lastName"],
                },
                {
                    model: this.repository.models.TransactionStatus,
                    as: "transactionStatus",
                    attributes: ["name"],
                }
            ];
            const {count, rows} = await this.repository.getAll(page, limit, null, include);
            return {
                total: count,
                data: rows
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data) {
        try {
            let createdUser = await this.repository.addItem(data)
            return createdUser;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = TransactionService