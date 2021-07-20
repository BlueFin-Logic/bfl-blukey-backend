const TransDocsRepository = require('../repositories/transactionDocumentType')
const TransDocsService = require('../services/transactionDocumentType')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const tableName = "TransactionDocumentType";

module.exports.delete = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            let storage = appContext.getStorage;
            let models = appContext.getDB;
            let repository = new TransDocsRepository(models);
            let service = new TransDocsService(repository, storage);

            let data = await service.delete(body);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}