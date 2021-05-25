const CustomError = require('../response_error/error');

// Authorize user
module.exports.authorizedController = function authorizedController(appContext) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (!token) throw CustomError.unauthorized(`Authentication Controller`, "Token is not found!" )

            const tokenService = appContext.getTokenJWT;
            let decoded = tokenService.verify(token);

            req.currentUserId = decoded.id;
            req.currentUserRole = decoded.is_admin;
            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.unauthorized(`Authorized Controller`, `Unauthorized.`, err));
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