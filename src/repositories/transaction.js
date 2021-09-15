const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = [
    'id',
    'address',
    'city',
    'state',
    'zipCode',
    'mlsId',
    'apn',
    'listingPrice',
    'commissionAmount',
    'buyerName',
    'sellerName',
    'listingStartDate',
    'listingEndDate',
    'createdAt',
    'updatedAt'
];
const Time = require('../helper/time');
const {Op} = require('sequelize');

class TransactionRepository extends BaseRepository {
    constructor(models) {
        super(models.Transaction, models);
    }

    getAll(page, limit, fields = null, conditions = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getAll(page, limit, fields, conditions, include, true, true);
    }

    countDocumentTypeRequired(isListing = true) { // isListing or isBuying
        try {
            return this.models.DocumentType.count({
                where: {
                    isRequired: true,
                    [Op.or]: [
                        {
                            isBoth: true
                        },
                        {
                            isListing: isListing
                        }
                    ]
                }
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
    
    getById(id, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields, include);
    }
    
    getOne(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include);
    }

    getByCondition(conditions, fields = null, include = null, order = null , paranoid = true, group = null) {
        if (!fields) fields = defaultFields;
        return super.getByCondition(conditions, fields, include , order, paranoid, group);
    }

    addItem(data) {
        try {
            // data.transactionStatusId = 1; // Status NEW
            data.listingStartDate = Time.formatTimeUTCToString(data.listingStartDate);
            data.listingEndDate = Time.formatTimeUTCToString(data.listingEndDate);
            const fields = [
                'userId',
                'address',
                'city',
                'state',
                'zipCode',
                'mlsId',
                'apn',
                'listingPrice',
                'commissionAmount',
                'buyerName',
                'sellerName',
                'isListing',
                'transactionStatusId',
                'listingStartDate',
                'listingEndDate'
            ];
            return super.addItem(data, fields);
        } catch (error) {
            throw error;
        }
    }

    updateItem(data, conditions) {
        const fields = [
            'address',
            'city',
            'state',
            'zipCode',
            'mlsId',
            'apn',
            'listingPrice',
            'commissionAmount',
            'buyerName',
            'sellerName',
            'isListing',
            'listingStartDate',
            'listingEndDate'
        ];
        return super.updateItem(data, conditions, fields);
    }

    updateItemStatus(data, conditions) {
        const fields = ['transactionStatusId'];
        return super.updateItem(data, conditions, fields);
    }

    getRestDocumentTypeRequired(transactionId, transactionIsListing) {
        try {
            return this.models.DocumentType.findAll({
                attributes: ["id"],
                include: {
                    model: this.models.TransactionDocumentType,
                    as: "transactionDocumentTypes",
                    attributes: ['fileName'],
                    where: {
                        transactionId: transactionId
                    },
                    required: false
                },
                where: {
                    '$transactionDocumentTypes.fileName$': {
                        [Op.eq]: null
                    },
                    isRequired: true,
                    [Op.or]: [
                        {
                            isBoth: true
                        },
                        {
                            isListing: transactionIsListing
                        }
                    ]
                }
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    async getEmailUserIsAdminWithoutMe(userId) {
        try {
            const users = await this.models.User.findAll({
                attributes: ['email'],
                where: {
                    isAdmin: true,
                    id: {
                        [Op.not]: userId
                    }
                },
                raw: true
            });

            let listOfEmail = "";

            users.forEach(user => listOfEmail += `${user.email},`);

            return listOfEmail;
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
}

module.exports = TransactionRepository