const UserRepository = require('../repositories/user')
const UserService = require('../services/user')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "User";

// Get All
module.exports.getAll = (appContext) => {
    return async (req, res, next) => {
        try {
            const page = Utilities.parseInt(req.query.page, 1);
            const limit = Utilities.parseInt(req.query.limit, 100);

            let models = appContext.getDB;
            let repository = new UserRepository(models);
            let service = new UserService(repository);

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
            let repository = new UserRepository(models);
            let service = new UserService(repository);

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
            const body = req.body;

            let models = appContext.getDB;
            let repository = new UserRepository(models);
            let service = new UserService(repository);

            let data = await service.create(body);

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
            const id = Utilities.parseInt(req.params.id, 1);
            
            let models = appContext.getDB;
            let repository = new UserRepository(models);
            let service = new UserService(repository);

            let data = await service.update(id, body);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Updated ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotUpdateEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}
