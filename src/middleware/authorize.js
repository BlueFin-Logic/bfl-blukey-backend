const CustomError = require('../response_error/error')
const AuthenHandler = require('../handlers/authen-handler')
const UserService = require('../services/user-service')

// Authorize user
module.exports.authorizedMiddleware = function authorizedMiddleware(appContext) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (!token) throw CustomError.unauthorized(`Authorized Middleware`, "Token is not found!" )

            const tokenService = appContext.getTokenJWT;
            let decoded = tokenService.verify(token);

            let db = appContext.getDB;
            let service = new UserService(db);
            let handler = new AuthenHandler(service);

            await handler.authorized(decoded.id);

            req.currentUserId = decoded.id;
            req.currentUserRole = decoded.is_admin;
            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.unauthorized(`Authorized Middleware`, `Unauthorized.`, err));
        }
    }
}

// class MiddlewareController {
//     // authorize token
//     async authorize(req, res, next) {
//         try {
//             const authHeader = req.headers['authorization']
//             const token = authHeader && authHeader.split(' ')[1]
//             if (token === null) throw CustomError.unauthorized(`Authentication Controller`, `Unauthorized.`, "Token is not found!")
//             let decoded = TokenService.verify(token);
//             req.currentUserId = decoded.id;
//             req.currentUserRole = decoded.is_admin;
//             next();
//         } catch (err) {
//             if (err instanceof CustomError) throw err;
//             throw CustomError.forbidden(`Authen Handler`, `Forbidden.`, err);
//         }
//     }
// }
// module.exports = new MiddlewareController();