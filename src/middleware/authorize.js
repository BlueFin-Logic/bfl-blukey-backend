const UserRepository = require('../repositories/user')
const AuthenService = require('../services/authen')
const MyError = require('../common/error')

// Authorize user
module.exports.authorize = (appContext) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (!token) throw MyError.unauthorized(`Authorized Middleware`, "Token is not found!" );

            const sessionService = appContext.getSession;
            const tokenService = appContext.getTokenJWT;

            const models = appContext.getDB;
            const repository = new UserRepository(models);
            const service = new AuthenService(repository);

            const user = await service.authorized(token, tokenService, sessionService);
            
            req.currentUser = {
                id: user.id,
                isAdmin : user.isAdmin
            };

            next();
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.unauthorized(`Authorized Middleware`, `Unauthorized.`, err));
        }
    }
}