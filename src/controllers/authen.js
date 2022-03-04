const Repository = require('../repositories/user')
const Service = require('../services/authen')
const MyResponse = require('../common/response')
const MyError = require('../common/error')
const tableName = "Authentication";

// Reset Password
module.exports.resetPassword = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository);

            const emailService = appContext.getEmail;
            const loggingDb = appContext.getLoggingDb;
            const data = await service.resetPassword(body, emailService, loggingDb);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Reset Password successful!`, data));
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.badRequest(`${tableName} Controller`, `Reset Password fail!`, err));
        }
    }
}

// Login
module.exports.login = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            const tokenService = appContext.getTokenJWT;
            const sessionService = appContext.getSession;

            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository);

            const data = await service.login(body, tokenService, sessionService);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Login successful!`, data));
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.unauthorized(`${tableName} Controller`, `Unauthorized!`, err));
        }
    }
}

// Logout
module.exports.logout = (appContext) => {
    return async (req, res, next) => {
        try {
            const sessionService = appContext.getSession;

            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository);

            const currentUserId = req.currentUser.id;
            const data = await service.logout(currentUserId, sessionService);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Logout successful!`, data));
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.badRequest(`${tableName} Controller`, `Logout fail!`, err));
        }
    }
}