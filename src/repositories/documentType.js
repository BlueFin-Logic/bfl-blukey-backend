const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['id', 'name','isRequired'];

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
                attributes: ['id', 'userId', 'transactionStatusId'],
                where: {
                    id: transactionId
                }
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }

    }
}
module.exports = DocumentTypeRepository