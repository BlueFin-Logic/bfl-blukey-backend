const Repository = require('../repositories/transactionDocumentType')
const Service = require('../services/transactionDocumentType')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "TransactionDocumentType";

module.exports.delete = (appContext) => {
    return async (req, res, next) => {
        try {
            const transdocsId = {
                transactionId: Utilities.parseInt(req.body.transactionId, 0),
                documentTypeId: Utilities.parseInt(req.body.documentTypeId, 0)
            };

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser, storage);

            const data = await service.delete(transdocsId);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}