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
            if (query.address) {
                whereTransaction.address = {
                    [Op.substring]: `${query.address}`
                };
            }
            if (query.buyerName) {
                whereTransaction.buyerName = query.buyerName;
            }
            if (query.sellerName) {
                whereTransaction.sellerName = query.sellerName;
            }
            if (query.isListing) {
                whereTransaction.isListing = query.isListing;
            }

            const fields = [
                'id', 'address', 'city', 'state', 'zipCode', 'mlsId', 'apn', 'listingPrice', 'commissionAmount', 'buyerName', 'sellerName', 'isListing', 'listingStartDate', 'listingEndDate', 'updatedAt',
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
                {
                    model: this.repository.models.DocumentType,
                    as: "documentTypes",
                    attributes: ["id"],
                    required: false,
                    through: {
                        as: "transactionDocumentTypes",
                        attributes: []
                    },
                    where: {
                        isRequired: true,
                        [Op.or]: [
                            {
                                isBoth: true
                            },
                            {
                                isListing: {
                                    [Op.eq]: Sequelize.col('[Transaction].[isListing]')
                                }
                            }
                        ]
                    }
                }
            ];

            const [{ count, rows }, totalIsListing, totalIsBuying] = await Promise.all([
                // Get all Transaction
                this.repository.getAll(page, limit, fields, whereTransaction, include),
                // Count DocumentType Required Is Listing
                this.repository.countDocumentTypeRequired(true),
                // Count DocumentType Required Is Buying
                this.repository.countDocumentTypeRequired(false)
            ]);

            return {
                total: count,
                data: rows.map(row => {
                    const { documentTypes } = row;
                    return {
                        ...row.toJSON(),
                        totalDocumentUploadedRequired: documentTypes.length,
                        totalDocumentRequired: row.isListing ? totalIsListing : totalIsBuying
                    }
                })
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
            if (!transaction) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction is not found!");
            return transaction;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async suggest(query) {
        try {
            const {
                buyerName,
                sellerName
            } = query;

            if (!buyerName && !sellerName) throw CustomError.badRequest(`${this.tableName} Service`, "Record is not found!");

            let conditions = {};
            let fields = [];
            let group = [];
            let order = [];

            if (buyerName) {
                conditions = {
                    buyerName: {
                        [Op.substring]: `${buyerName}`
                    }
                };
                fields = ['buyerName'];
                group = ['buyerName'];
                order = [
                    ['buyerName', 'ASC']
                ]
            }

            if (sellerName) {
                conditions = {
                    sellerName: {
                        [Op.substring]: `${sellerName}`
                    }
                };
                fields = ['sellerName'];
                group = ['sellerName'];
                order = [
                    ['sellerName', 'ASC']
                ]
            }

            if (!this.currentUser.isAdmin) conditions.userId = this.currentUser.id;

            const transaction = await this.repository.getByCondition(conditions, fields, null, order, true, group);
            // Check transaction is exist.
            if (!transaction) throw CustomError.badRequest(`${this.tableName} Service`, "Record is not found!");
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
            throw CustomError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async update(transId, data) {
        try {
            const transactionExist = await this.repository.getById(transId, ['id', 'userId', 'transactionStatusId']);
            // Check transaction is exist.
            if (!transactionExist) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction is not found!");
            // Check transaction belongs to User.
            if (transactionExist.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction is not belong to you!");
            // Only permission update when status is NEW(1) or IN PROCESS(2)
            if (transactionExist.transactionStatusId !== 1 && transactionExist.transactionStatusId !== 2) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction can not update because status is not NEW or IN PROCESS!");

            const result = await this.repository.updateItem(data, {id: transId});
            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async status(transId, status, emailService) {
        try {
            const transaction = await this.repository.getById(transId, ['id', 'userId', 'transactionStatusId', 'address', 'city', 'state', 'zipCode', 'mlsId', 'apn', 'listingPrice', 'commissionAmount', 'buyerName', 'sellerName', 'isListing', 'listingStartDate', 'listingEndDate', 'createdAt', 'updatedAt']);
            // Check transaction is exist.
            if (!transaction) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction is not found!");

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

                // Check no document required not uploaded
                const rest = await this.repository.getRestDocumentTypeRequired(transId, transaction.isListing);

                if (rest.length > 0) throw CustomError.badRequest(`${this.tableName} Service`, "Need upload all required documents before change status to review!");

                const [listOfEmailAdmin, user] = await Promise.all([
                    // Get list of email admin without me
                    this.repository.getEmailUserIsAdminWithoutMe(this.currentUser.id),
                    // Get info user's transaction
                    transaction.getUser({
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    }),
                    // Change to [REVIEW]
                    this.repository.updateItemStatus(
                        {
                            transactionStatusId: status // [REVIEW]
                        },
                        {
                            id: transId
                        }
                    )
                ]);

                transaction.user = user;
                // Send email review status
                emailService.sendMail(
                    listOfEmailAdmin,
                    emailService.reviewTransactionSubject(transId),
                    emailService.reviewTransactionContent(transaction)
                );

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            // **Change to [COMPLETE]: and user is Admin and <- [REVIEW]
            if (status === 4
                && this.currentUser.isAdmin
                && transaction.transactionStatusId === 3) {

                const [user] = await Promise.all([
                    // Get info user's transaction
                    transaction.getUser({
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    }),
                    // Change to [COMPLETE]
                    this.repository.updateItemStatus(
                        {
                            transactionStatusId: status // [COMPLETE]
                        },
                        {
                            id: transId
                        }
                    )
                ]);

                transaction.user = user;
                // Send email complete status
                emailService.sendMail(
                    transaction.user.email,
                    emailService.completedTransactionSubject(transId),
                    emailService.completedTransactionContent(transaction)
                );

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            // **Change to [ERROR]: and user is Admin and <- [REVIEW]
            if (status === 5
                && this.currentUser.isAdmin
                && transaction.transactionStatusId === 3) {

                const [user] = await Promise.all([
                    // Get info user's transaction
                    transaction.getUser({
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    }),
                    // Change to [ERROR]
                    this.repository.updateItemStatus(
                        {
                            transactionStatusId: status // [ERROR]
                        },
                        {
                            id: transId
                        }
                    )
                ]);

                transaction.user = user;
                // Send email error status
                emailService.sendMail(
                    transaction.user.email,
                    emailService.errorTransactionSubject(transId),
                    emailService.errorTransactionContent(transaction)
                );

                return {
                    transactionId: transId,
                    transactionStatusId: status
                }
            }

            throw CustomError.badRequest(`${this.tableName} Service`, `Cannot update status for transaction Id: ${transId}`);
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = TransactionService