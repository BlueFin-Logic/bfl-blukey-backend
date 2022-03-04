const Repository = require('../repositories/documentType')
const Service = require('../services/documentType')
const MyResponse = require('../common/response')
const MyError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "DocumentType";

module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            const transactionId = Utilities.parseInt(req.params.transactionId, 0);

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser, storage);

            const data = await service.getDocumentTypeByTransactionId(transactionId);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Get All
module.exports.getAll = (appContext) => {
    return async (req, res, next) => {
        try {
            const page = Utilities.parseInt(req.query.page, 1);
            const limit = Utilities.parseInt(req.query.limit, 1);
            const query = req.query;

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const {total, data} = await service.getAll(page, limit, query);

            let paging = {
                page: page,
                total: total
            }
            next(MyResponse.newSuccessResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data, paging))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Get By ID
module.exports.getById = (appContext) => {
    return async (req, res, next) => {
        try {
            const documentTypeId = Utilities.parseInt(req.params.id, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const data = await service.getById(documentTypeId);

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
            const documentTypeId = Utilities.parseInt(req.params.id, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const loggingDb = appContext.getLoggingDb;
            const data = await service.update(documentTypeId, body, loggingDb);
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
            const documentTypeId = Utilities.parseInt(req.params.id, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const loggingDb = appContext.getLoggingDb;
            const data = await service.delete(documentTypeId, loggingDb);
            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Deleted ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotDeleteEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}