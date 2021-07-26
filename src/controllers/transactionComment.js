const Repository = require('../repositories/transactionComment')
const Service = require('../services/transactionComment')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
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

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get ${tableName} by id successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotGetEntity(`${tableName} Controller`, `${tableName}`, err));
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

            const data = await service.create(body);

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Created ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotCreateEntity(`${tableName} Controller`, `${tableName}`, err));
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

            const data = await service.update(transCommentId, body);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Updated ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotUpdateEntity(`${tableName} Controller`, `${tableName}`, err));
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

            const data = await service.delete(transCommentId);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}
