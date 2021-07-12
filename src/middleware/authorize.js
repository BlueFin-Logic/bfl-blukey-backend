const UserRepository = require('../repositories/user')
const AuthenService = require('../services/authen')
const CustomError = require('../common/error')

// Authorize user
module.exports.authorize = (appContext) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (!token) throw CustomError.unauthorized(`Authorized Middleware`, "Token is not found!" )

            const tokenService = appContext.getTokenJWT;
            const decoded = tokenService.verify(token);

            let models = appContext.getDB;
            let repository = new UserRepository(models);
            let service = new AuthenService(repository);

            await service.authorized(decoded.id);

            req.currentUserId = decoded.id;
            req.currentUserIsAdmin = decoded.isAdmin;
            next();
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.unauthorized(`Authorized Middleware`, `Unauthorized.`, err));
        }
    }
}