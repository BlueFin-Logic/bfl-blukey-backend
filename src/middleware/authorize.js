const { Utilities } = require('../common/utilities')
const { TokenService } = require('../common/token');
const { STATUS_UNAUTHORIZED, STATUS_FORBIDDEN } = require('../common/statusResponse')

// Login user
module.exports.authorizeController = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token === null) return res.status(STATUS_UNAUTHORIZED).json(Utilities.responseSimple("Unauthorized."))
        let decoded = TokenService.verify(token);
        req.currentUserId = decoded.id;
        req.currentUserRole = decoded.is_admin;
        next();
    } catch (err) {
        console.log(err);
        return res.status(STATUS_FORBIDDEN).json(err)
    }
}