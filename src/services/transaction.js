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
                    attributes: ["id", "firstName", "lastName", "deactivatedAt"],
                    paranoid: false
                },
                {
                    model: this.repository.models.TransactionStatus,
                    as: "transactionStatus",
                    attributes: ["name"]
                },
                {
                    model: this.repository.models.DocumentType,
                    as: "documentTypes",
                    // attributes: ["id", "name", "isRequired"],
                    attributes: ["id"],
                    through: {
                        as: "transactionDocumentTypes",
                        // attributes: ['fileName'],
                        attributes: []
                    },
                    where: {
                        isRequired: true
                    },
                    required: false
                }
            ];

            const [transactions, totalTrans, totalDocumentRequired] = await Promise.all([
                this.repository.getAll(page, limit, null, null, include),
                this.repository.countItem({ col: 'id' }),
                this.repository.countDocumentTypeRequired(true),
            ]);

            return {
                total: totalTrans,
                data: transactions.map(transaction => {
                    return {
                        documentUploadedRequired: `${transaction.documentTypes.length}/${totalDocumentRequired}`,
                        ...transaction.toJSON()
                    }
                })
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getById(id) {
        try {
            const include = [
                {
                    model: this.repository.models.User,
                    as: "user",
                    attributes: ["id", "firstName", "lastName", "deactivatedAt"],
                    paranoid: false
                },
                {
                    model: this.repository.models.TransactionStatus,
                    as: "transactionStatus",
                    attributes: ["name"]
                }
            ];

            let transaction = await this.repository.getById(id, null, include);
            // Check user is exist.
            if (!transaction) throw CustomError.badRequest(`${this.table} Handler`, "Transaction is not found!");
            return transaction;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
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