const Repository = require('../repositories/transactionDocumentType')
const Service = require('../services/transactionDocumentType')
const MyResponse = require('../common/response')
const MyError = require('../common/error')
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

            const loggingDb = appContext.getLoggingDb;
            const data = await service.delete(transdocsId, loggingDb);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}