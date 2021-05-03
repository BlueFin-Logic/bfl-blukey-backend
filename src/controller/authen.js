const AuthenService = require('../services/authenService')
const { Utilities } = require('../common/utilities')
const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST } = require('../common/statusResponse')

// // Login user
// module.exports.authenLoginController = async (req, res) => {
//     try {
//         const body = req.body;

//         let authenService = new AuthenService();
//         let result = await authenService.login(body)
//         console.log(result);
//         return res.status(STATUS_OK).json(Utilities.responseSimple(result))
//     } catch (err) {
//         console.log(err);
//         return res.status(STATUS_BAD_REQUEST).json(err)
//     }
// }

class AuthenController {
    // Login user
    async login(req, res, next) {
        try {
            const body = req.body;

            let authenService = new AuthenService();
            let result = await authenService.login(body)
            console.log(result);
            return res.status(STATUS_OK).json(Utilities.responseSimple(result))
        } catch (err) {
            console.log(err);
            return res.status(STATUS_BAD_REQUEST).json(err)
        }
    }
}
module.exports = new AuthenController();