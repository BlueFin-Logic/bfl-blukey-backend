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
    'createdAt'
];
const time = require('../helper/time');

class TransactionRepository extends BaseRepository {
    constructor(models) {
        super(models.Transaction, models);
    }

    getAll(page, limit, conditions = null, include = null) {
        let fields = defaultFields;
        return super.getAll(page, limit, fields, conditions, include);
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