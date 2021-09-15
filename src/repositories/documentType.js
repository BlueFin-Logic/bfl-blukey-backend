const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['id', 'name','isRequired', 'isBoth', 'isListing'];

class DocumentTypeRepository extends BaseRepository {
    constructor(models) {
        super(models.DocumentType, models);
    }

    getByCondition(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getByCondition(conditions, fields, include)
    }

    getTransactionInfo(transactionId) {
        try {
            return this.models.Transaction.findOne({
                attributes: ['id', 'userId', 'transactionStatusId', 'isListing'],
                where: {
                    id: transactionId
                }
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getAll(page, limit, conditions) {
        return super.getAll(page, limit, defaultFields, conditions);
    }

    getById(id, fields) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields);
    }

    addItem(data, transaction = null) {
        const fields = ['name','isRequired', 'isBoth', 'isListing'];
        return super.addItem(data, fields, transaction);
    }

    updateItem(data, conditions, transaction = null) {
        const fields = ['name','isRequired', 'isBoth', 'isListing'];
        return super.updateItem(data, conditions, fields, transaction);
    }

    deleteItem(conditions, transaction = null) {
        return super.deleteItem(conditions, true, transaction);
    }

    getDocumentTypeIsUsed(documentTypeId) {
        try {
            return this.models.TransactionDocumentType.findOne({
                attributes: ['transactionId', 'documentTypeId'],
                where: {
                    documentTypeId: documentTypeId
                },
                paranoid: false
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
}
module.exports = DocumentTypeRepository