const AuthenHandler = require('../handlers/authen-handler')
const {HashService} = require('../common/hash')
const CustomResponse = require('../response_error/response')
const CustomError = require('../response_error/error')
const UserModel = require('../model/user')
const UserService = require('../services/user-service')

module.exports.login = function login(appContext) {
    return async (req, res, next) => {
        try {
            const body = req.body;

            let db = appContext.getPoolMSSQL;
            let token = appContext.getTokenJWT;
            let service = new UserService(db);
            let handler = new AuthenHandler(service);

            let data = await handler.login(body, token, HashService);
            next(CustomResponse.newSimpleResponse(`Authentication Controller`, `Login successful!`, data));
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.cannotGetEntity(`Authentication Controller`, `${UserModel.tableName}`, err));
        }
    }
}