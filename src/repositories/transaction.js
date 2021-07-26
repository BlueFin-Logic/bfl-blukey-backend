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
        return super.getAll(page, limit, fields, conditions, include);
    }

    // countDocumentTypeRequired(required = true) {
    //     try {
    //         return this.models.DocumentType.count({ where: { isRequired: required } });
    //     } catch (error) {
    //         throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
    //     }
    // }
    
    getById(id, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields, include);
    }
    
    getOne(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include);
    }

    addItem(data) {
        try {
            data.transactionStatusId = 1; // Status NEW
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
            'listingStartDate',
            'listingEndDate'
        ];
        return super.updateItem(data, conditions, fields);
    }

    updateItemStatus(data, conditions) {
        const fields = ['transactionStatusId'];
        return super.updateItem(data, conditions, fields);
    }

    getRestDocumentTypeRequired(transactionId, required = true) {
        try {
            return this.models.DocumentType.findAll({
                attributes: ["id", "name", "isRequired"],
                include: {
                    model: this.models.TransactionDocumentType,
                    as: "transactionDocumentTypes",
                    where: {
                        transactionId: transactionId
                    },
                    attributes: ['fileName'],
                    required: false
                },
                where: {
                    '$transactionDocumentTypes.fileName$': {
                        [Op.eq]: null
                    },
                    isRequired: required
                }
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
}

module.exports = TransactionRepository