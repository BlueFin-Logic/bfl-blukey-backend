const TransactionRepository = require('../repositories/transaction')
const TransactionrService = require('../services/transaction')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "Transaction";

// Get All
module.exports.getAll = (appContext) => {
    return async (req, res, next) => {
        try {
            const page = Utilities.parseInt(req.query.page, 1);
            const limit = Utilities.parseInt(req.query.limit, 100);

            let models = appContext.getDB;
            let repository = new TransactionRepository(models);
            let service = new TransactionrService(repository);

            let {total, data} = await service.getAll(page, limit);

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
            const id = Utilities.parseInt(req.params.id, 1);

            let models = appContext.getDB;
            let repository = new TransactionRepository(models);
            let service = new TransactionrService(repository);

            let data = await service.getById(id);

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
            req.body.userId = req.currentUserId;
            const body = req.body;

            let models = appContext.getDB;
            let repository = new TransactionRepository(models);
            let service = new TransactionrService(repository);

            let data = await service.create(body);

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Created ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotCreateEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}