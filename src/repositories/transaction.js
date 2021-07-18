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
    'canComplete',
    'listingStartDate',
    'listingEndDate',
    'createdAt',
    'updatedAt'
];
const time = require('../helper/time');

class TransactionRepository extends BaseRepository {
    constructor(models) {
        super(models.Transaction, models);
    }

    getAll(page, limit, fields = null, conditions = null, include = null) {
        try {
            if (!fields) fields = defaultFields;
            if (page < 1) page = 1;
            if (limit < 1) limit = 5;
            if (limit > 100) limit = 100;
            const offset = (page - 1) * limit;
            return this.table.findAll({
                attributes: fields,
                where: conditions,
                include: include,
                offset: offset,
                limit: limit,
                order: [
                    ['updatedAt', 'DESC'],
                ],
            });
        } catch (error) {
            throw CustomError.cannotListEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    countDocumentTypeRequired(required = true) {
        try {
            return this.models.DocumentType.count({ where: { isRequired: required } });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
    //
    // getById(id, fields = null, include = null) {
    //     if (!fields) fields = defaultFields;
    //     return super.getById(id, fields, include);
    // }
    //
    // getOne(conditions, fields = null, include = null) {
    //     if (!fields) fields = defaultFields;
    //     return super.getOne(conditions, fields, include);
    // }
    //
    // getByCondition(conditions, fields = null, include = null) {
    //     if (!fields) fields = defaultFields;
    //     return super.getByCondition(conditions, fields, include);
    // }

    addItem(data, fields = null) {
        try {
            data.transactionStatusId = 1; // Status NEW
            data.canComplete = 0;
            data.listingStartDate = time.formatTimeUTCToString(data.listingStartDate);
            data.listingEndDate = time.formatTimeUTCToString(data.listingEndDate);
            return super.addItem(data, fields);
        } catch (error) {
            throw error;
        }
    }

    // updateItem(userName, data, conditions, fields = null) {
    //     data.userName = userName; // for hash pass
    //     return super.updateItem(data, conditions, fields);
    // }
}

module.exports = TransactionRepository