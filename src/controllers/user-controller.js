const UserHandler = require('../handlers/user-handler')
const UserService = require('../services/user-service')
const CustomResponse = require('../response_error/response')
const CustomError = require('../response_error/error')
const UserModel = require('../model/user')
const HashService = require('../common/hash')
const { Utilities } = require('../common/utilities')
// const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST, STATUS_FORBIDDEN } = require('../common/statusResponse')

// Get All Users
module.exports.listUser = function listUser(appContext) {
    return async (req, res, next) => {
        try {
            const page = Utilities.parseInt(req.query.page, 1);
            const limit = Utilities.parseInt(req.query.limit, 100);

            // // Only admin can get all
            // const is_admin = req.currentUserRole;
            // if (!is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

            let db = appContext.getPoolMSSQL;
            let service = new UserService(db);
            let handler = new UserHandler(service);

            let data = await handler.getAll(page, limit);

            let paging = {
                page: page,
                total: data.length
            }

            next(CustomResponse.newSuccessResponse(`${UserModel.tableName} Controller`, `Get list users successful.`, data, paging))
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.cannotListEntity(`${UserModel.tableName} Controller`, `${UserModel.tableName}`, err));
        }
    }
}

// Get User By ID
module.exports.getByIdUser = function getByIdUser(appContext) {
    return async (req, res, next) => {
        try {
            const id = Utilities.parseInt(req.params.id, 1);

            // Only user can get data yourseft or admin
            // const currentUserId = req.currentUserId;
            // const is_admin = req.currentUserRole;
            // if (currentUserId !== id && !is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

            let db = appContext.getPoolMSSQL;
            let service = new UserService(db);
            let handler = new UserHandler(service);

            let data = await handler.getById(id);

            next(CustomResponse.newSimpleResponse(`${UserModel.tableName} Controller`, `Get users by id successful.`, data))
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.cannotGetEntity(`${UserModel.tableName} Controller`, `${UserModel.tableName}`, err));
        }
    }
}

// Create user
module.exports.createUser = function createUser(appContext) {
    return async (req, res, next) => {
        try {
            const body = req.body;

            // Only admin can create
            // const is_admin = req.currentUserRole;
            // if (!is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

            let db = appContext.getPoolMSSQL;
            let service = new UserService(db);
            let handler = new UserHandler(service);
            let hash = new HashService();

            let data = await handler.addItem(body, hash);
            next(CustomResponse.newSimpleResponse(`${UserModel.tableName} Controller`, `Create user successful.`, data))
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.cannotCreateEntity(`${UserModel.tableName} Controller`, `${UserModel.tableName}`, err));
        }
    }
}

// Update user
module.exports.updateUser = function updateUser(appContext) {
    return async (req, res, next) => {
        try {
            const body = req.body;
            const id = Utilities.parseInt(req.params.id, 1);

            // Only user can edit data yourseft or admin
            // const currentUserId = req.currentUserId;
            // const is_admin = req.currentUserRole;
            // if (currentUserId !== id && !is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

            let db = appContext.getPoolMSSQL;
            let service = new UserService(db);
            let handler = new UserHandler(service);
            let hash = new HashService();

            let data = await handler.updateItem(id, body, hash);
            next(CustomResponse.newSimpleResponse(`${UserModel.tableName} Controller`, `Update user successful.`, data))
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.cannotCreateEntity(`${UserModel.tableName} Controller`, `${UserModel.tableName}`, err));
        }
    }
}

// Delete user
module.exports.deleteUser = function deleteUser(appContext) {
    return async (req, res, next) => {
        try {
            const id = req.params.id;

            // Only admin can delete
            const is_admin = req.currentUserRole;
            if (!is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

            let userHandler = new UserHandler();
            let result = await userHandler.deleteItem(id)
            console.log(result);
            return res.status(STATUS_OK).json(result)
        } catch (err) {
            console.log(err);
            return res.status(STATUS_BAD_REQUEST).json(err)
        }
    }
}

// Register user
module.exports.registerUser = function registerUser(appContext) {
    return async (req, res, next) => {
        try {
            const body = req.body;

            let userHandler = new UserHandler();
            let result = await userHandler.addItem(body)
            console.log(result);
            return res.status(STATUS_CREATED).json(result)
        } catch (err) {
            console.log(err);
            return res.status(STATUS_BAD_REQUEST).json(err)
        }
    }
}

// Ping user
module.exports.pingUser = function pingUser(appContext) {
    return async (req, res, next) => {
        try {
            // console.log(appContext);
            let userHandler = new UserHandler();
            let result = await userHandler.ping(appContext)
            console.log(result);
            return res.status(STATUS_OK).json(result)
        } catch (err) {
            console.log(err);
            return res.status(STATUS_BAD_REQUEST).json(err)
        }
    }
}