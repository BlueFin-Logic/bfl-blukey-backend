const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['transactionId', 'documentTypeId', 'container', 'folder', 'fileName', 'updatedAt'];
const {Op} = require('sequelize');

class TransactionDocumentTypeRepository extends BaseRepository {
    constructor(models) {
        super(models.TransactionDocumentType, models);
    }

    getOne(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include);
    }

    getByCondition(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        const order = [
            ['updatedAt', 'DESC']
        ]
        return super.getByCondition(conditions, fields, include, order)
    }

    getRestDocumentType(transactionId, required = true, transactionIsListing) {
        try {
            return this.models.DocumentType.findAll({
                attributes: ['id', 'name', 'isRequired', 'isListing', 'isBoth'],
                include: {
                    model: this.models.TransactionDocumentType,
                    as: "transactionDocumentTypes",
                    where: {
                        transactionId: transactionId
                    },
                    attributes: [],
                    required: false
                },
                where: {
                    '$transactionDocumentTypes.fileName$': {
                        [Op.eq]: null
                    },
                    isRequired: required,
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

    getDocumentTypeInfo(documentTypeId) {
        try {
            return this.models.DocumentType.findOne({
                attributes: ['id', 'name', 'isRequired', 'isListing', 'isBoth'],
                where: {
                    id: documentTypeId
                }
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
}
module.exports = TransactionDocumentTypeRepository