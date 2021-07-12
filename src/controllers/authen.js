const UserRepository = require('../repositories/user')
const AuthenService = require('../services/authen')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const tableName = "Authentication";

module.exports.login = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            let token = appContext.getTokenJWT;

            let models = appContext.getDB;
            let repository = new UserRepository(models);
            let service = new AuthenService(repository);

            let data = await service.login(body, token);

            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Login successful!`, data));
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.unauthorized(`${tableName} Controller`, `Unauthorized.`, err));
        }
    }
}