const Repository = require('../repositories/documentUser')
const Service = require('../services/documentUser')
const MyResponse = require('../common/response')
const MyError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "DocumentUser";

module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            const userId = Utilities.parseInt(req.query.userId, 0);

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser, storage);

            const data = await service.getDocumentInfoByUserId(userId);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

module.exports.delete = (appContext) => {
    return async (req, res, next) => {
        try {
            const id = Utilities.parseInt(req.params.id, 0);

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser, storage);

            const loggingDb = appContext.getLoggingDb;
            const data = await service.delete(id, loggingDb);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}