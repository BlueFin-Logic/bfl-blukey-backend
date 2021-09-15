const Repository = require('../repositories/transaction')
const Service = require('../services/transaction')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "Transaction";

// Get All
module.exports.getAll = (appContext) => {
    return async (req, res, next) => {
        try {
            const page = Utilities.parseInt(req.query.page, 1);
            const limit = Utilities.parseInt(req.query.limit, 10);
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
            next(CustomResponse.newSuccessResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data, paging))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Get By ID
module.exports.getById = (appContext) => {
    return async (req, res, next) => {
        try {
            const transId = Utilities.parseInt(req.params.id, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const data = await service.getById(transId);

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get ${tableName} by id successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotGetEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Search Suggest
module.exports.suggest = (appContext) => {
    return async (req, res, next) => {
        try {
            const query = req.query;

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const data = await service.suggest(query);

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Create
module.exports.create = (appContext) => {
    return async (req, res, next) => {
        try {
            const transaction = req.body;

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const data = await service.create(transaction);

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
            const transId = Utilities.parseInt(req.params.id, 0);
            const body = req.body;

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const data = await service.update(transId, body);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Updated ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotUpdateEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}

// Status
module.exports.status = (appContext) => {
    return async (req, res, next) => {
        try {
            const transId = Utilities.parseInt(req.params.id, 0);
            const status = Utilities.parseInt(req.body.status, 0);

            const currentUser = req.currentUser;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser);

            const emailService = appContext.getEmail;
            const data = await service.status(transId, status, emailService);

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Updated status for ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotUpdateEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}