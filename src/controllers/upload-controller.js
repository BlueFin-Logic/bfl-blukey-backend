const AuthenHandler = require('../handlers/authen-handler')
const {HashService} = require('../common/hash')
const CustomResponse = require('../response_error/response')
const CustomError = require('../response_error/error')
const UserService = require('../services/user-service')

module.exports.upload = function upload(appContext) {
    return async (req, res, next) => {
        try {
            let file = req.file;
            let lam = ""
            // const body = req.body;
            //
            // let db = appContext.getPoolMSSQL;
            // let token = appContext.getTokenJWT;
            // let service = new UserService(db);
            // let handler = new AuthenHandler(service);
            //
            // let data = await handler.login(body, token, HashService);
            next(CustomResponse.newSimpleResponse(`Upload Controller`, `Upload successful!`, lam));
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.unauthorized(`Upload Controller`, `Upload had problems!.`, err));
        }
    }
}