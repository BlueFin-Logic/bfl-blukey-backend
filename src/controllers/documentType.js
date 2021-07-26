const Repository = require('../repositories/documentType')
const Service = require('../services/documentType')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "DocumentType";

module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            const transactionId = Utilities.parseInt(req.query.transactionId, 0);

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser, storage);

            const data = await service.getDocumentTypeByTransactionId(transactionId);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}