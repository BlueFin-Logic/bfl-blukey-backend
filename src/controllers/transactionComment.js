const Repository = require('../repositories/transactionComment')
const Service = require('../services/transactionComment')
const MyResponse = require('../common/response')
const MyError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "TransactionComment";

// Get By Condition
module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            const transactionId = Utilities.parseInt(req.query.transactionId, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const data = await service.getByTransactionId(transactionId);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Get ${tableName} by id successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotGetEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}
// Create
module.exports.create = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const loggingDb = appContext.getLoggingDb;
            const data = await service.create(body, loggingDb);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Created ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotCreateEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}
// Update
module.exports.update = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;
            const transCommentId = Utilities.parseInt(req.params.id, 0);
            
            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const loggingDb = appContext.getLoggingDb;
            const data = await service.update(transCommentId, body, loggingDb);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Updated ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotUpdateEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Delete
module.exports.delete = (appContext) => {
    return async (req, res, next) => {
        try {
            const transCommentId = Utilities.parseInt(req.params.id, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const loggingDb = appContext.getLoggingDb;
            const data = await service.delete(transCommentId, loggingDb);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}
