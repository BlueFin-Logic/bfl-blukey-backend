const BaseService = require('./base');
const CustomError = require('../common/error');
const Utilities = require('../helper/utilities');
const Time = require('../helper/time');
const {Op, Sequelize} = require('sequelize');

class TransactionService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getAll(page, limit, query) {
        try {
            let whereTransaction = {};

            if (this.currentUser.isAdmin) {
                if (query.agentId) {
                    whereTransaction.userId = Utilities.parseInt(query.agentId, 0);
                }
            } else {
                whereTransaction.userId = this.currentUser.id;
            }

            if (query.startDate) {
                whereTransaction.listingStartDate = {
                    [Op.gte]: Time.formatTimeToStringDate(query.startDate)
                };
            }
            if (query.endDate) {
                whereTransaction.listingEndDate = {
                    [Op.lte]: Time.formatTimeToStringDate(query.endDate)
                };
            }
            if (query.transactionId) {
                whereTransaction.id = Utilities.parseInt(query.transactionId, 0);
            }
            if (query.transactionStatusId) {
                whereTransaction.transactionStatusId = Utilities.parseInt(query.transactionStatusId, 0);
            }

            const fields = [
                'id', 'address', 'city', 'state', 'zipCode', 'mlsId', 'apn', 'listingPrice', 'commissionAmount', 'buyerName', 'sellerName', 'listingStartDate', 'listingEndDate',
                [
                    Sequelize.literal(`(
                            SELECT COUNT([TransactionDocumentType].[transactionId])
                            FROM [TransactionDocumentType]
                            INNER JOIN [DocumentType] ON [DocumentType].[id] = [TransactionDocumentType].[documentTypeId]
                            WHERE [TransactionDocumentType].[transactionId] = [Transaction].[id] AND [DocumentType].[isRequired] = 1 AND [DocumentType].[deletedAt] IS NULL
                        )`),
                    'totalDocumentUploadedRequired'
                ],
                [
                    Sequelize.literal(`(
                            SELECT COUNT([DocumentType].[id])
                            FROM [DocumentType]
                            WHERE [DocumentType].[isRequired] = 1 AND [DocumentType].[deletedAt] IS NULL
                        )`),
                    'totalDocumentRequired'
                ]
            ];

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
                    model: this.repository.models.TransactionComment,
                    as: "transactionComments",
                    attributes: ['id', 'userId', 'comment', 'updatedAt'],
                    limit: 2,
                    order: [
                        ['updatedAt', 'DESC'],
                    ]
                },
            ];

            const {count, rows} = await this.repository.getAll(page, limit, fields, whereTransaction, include);

            return {
                total: count,
                data: rows
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getById(transId) {
        try {
            let conditions = {
                id: transId
            };

            if (!this.currentUser.isAdmin) conditions.userId = this.currentUser.id;

            const include = [
                {
                    model: this.repository.models.User,
                    as: "user",
                    attributes: ['id', 'firstName', 'lastName', 'deactivatedAt'],
                    paranoid: false
                },
                {
                    model: this.repository.models.TransactionStatus,
                    as: "transactionStatus",
                    attributes: ['name']
                }
            ];

            const transaction = await this.repository.getOne(conditions, null, include);
            // Check transaction is exist.
            if (!transaction) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction is not found!");
            return transaction;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(transaction) {
        try {
            transaction.userId = this.currentUser.id;
            const result = await this.repository.addItem(transaction);
            return {
                id: result.id
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async update(transId, data) {
        try {
            const transactionExist = await this.repository.getById(transId, ['id', 'userId', 'transactionStatusId']);
            // Check transaction is exist.
            if (!transactionExist) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction is not found!");
            // Check transaction belongs to User.
            if (transactionExist.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction is not belong to you!");
            // Only permission update when status is NEW(1) or IN PROCESS(2)
            if (transactionExist.transactionStatusId !== 1 && transactionExist.transactionStatusId !== 2) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction can not update because status is not NEW or IN PROCESS!");

            let result = await this.repository.updateItem(data, {id: transId});
            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async status(transId, status, emailService) {
        try {
            const transaction = await this.repository.getById(transId, ['id', 'userId', 'transactionStatusId']);
            // Check transaction is exist.
            if (!transaction) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction is not found!");

            // **Change to [IN PROCESS]: and transaction belongs to User and <- [NEW] or [ERROR]
            if (status === 2
                && transaction.userId === this.currentUser.id
                && (transaction.transactionStatusId === 1 || transaction.transactionStatusId === 5)) {

                // Change to [IN PROCESS]
                await this.repository.updateItemStatus(
                    {
                        transactionStatusId: status // [IN PROCESS]
                    },
                    {
                        id: transId
                    }
                );

                // Not send email

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            // **Change to [REVIEW]: and transaction belongs to User and <- [IN PROCESS]
            if (status === 3
                && transaction.userId === this.currentUser.id
                && transaction.transactionStatusId === 2) {

                // Check no rest document required not uploaded
                const rest = await this.repository.getRestDocumentTypeRequired(transId, true);

                if (rest.length > 0) throw CustomError.badRequest(`${this.tableName} Handler`, "Need upload all required documents before change status to review!");

                // Change to [REVIEW]
                await this.repository.updateItemStatus(
                    {
                        transactionStatusId: status // [REVIEW]
                    },
                    {
                        id: transId
                    }
                );

                // Get list of email admin & Get info user's transaction
                const [listOfEmailAdmin, user] = await Promise.all([
                    this.repository.getEmailUserIsAdmin(),
                    transaction.getUser({
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    })
                ]);
                transaction.user = user;
                // Send email review status
                const subject = emailService.reviewTransactionSubject(transId);
                const content = emailService.reviewTransactionContent(transaction);
                await emailService.sendMail(listOfEmailAdmin, subject, content);

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            // **Change to [COMPLETE]: and user is Admin and <- [REVIEW]
            if (status === 4
                && this.currentUser.isAdmin
                && transaction.transactionStatusId === 3) {

                // Change to [COMPLETE]
                await this.repository.updateItemStatus(
                    {
                        transactionStatusId: status // [COMPLETE]
                    },
                    {
                        id: transId
                    }
                );

                // Get info user's transaction
                transaction.user = await transaction.getUser({
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                });
                // Send email complete status
                const subject = emailService.completedTransactionSubject(transId);
                const content = emailService.completedTransactionContent(transaction);
                await emailService.sendMail(transaction.user.email, subject, content);

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            // **Change to [ERROR]: and user is Admin and <- [REVIEW]
            if (status === 5
                && this.currentUser.isAdmin
                && transaction.transactionStatusId === 3) {

                // Change to [ERROR]
                await this.repository.updateItemStatus(
                    {
                        transactionStatusId: status // [ERROR]
                    },
                    {
                        id: transId
                    }
                );

                // Get info user's transaction
                transaction.user = await transaction.getUser({
                    attributes: ['firstName', 'lastName', 'email'],
                    raw: true
                });
                // Send email error status
                const subject = emailService.errorTransactionSubject(transId);
                const content = emailService.errorTransactionContent(transaction);
                await emailService.sendMail(transaction.user.email, subject, content);

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            throw CustomError.badRequest(`${this.tableName} Handler`, `Cannot update status for transaction Id: ${transId}`);
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = TransactionService