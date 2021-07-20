const DocumentTypeRepository = require('../repositories/documentType')
const DocumentTypeService = require('../services/documentType')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "DocumentType";

module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            const transactionId = Utilities.parseInt(req.query.transactionId, 1);

            let storage = appContext.getStorage;

            let models = appContext.getDB;
            let repository = new DocumentTypeRepository(models);
            let service = new DocumentTypeService(repository, storage);

            let data = await service.getDocumentTypeByTransactionId(transactionId);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}