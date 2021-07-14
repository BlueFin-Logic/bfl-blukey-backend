const BaseService = require('../services/base');
const CustomError = require('../common/error');
const hash = require('../helper/hash');
const time = require('../helper/time');

class AuthenService extends BaseService {
    constructor(service) {
        super(service)
    }

    async login(item, token) {
        try {
            let itemUserName = item.userName;
            let itemPassword = item.password;

            let fields = ['id', 'firstName', 'lastName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate'];
            let userExist = await this.repository.getOne({userName: itemUserName}, fields);

            // Check user is exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");

            // Check user correct pass.
            if (userExist.password !== hash.hashPassword(userExist.userName, itemPassword)) throw CustomError.badRequest(`Authentication Handler`, "Invalid password!");

            // Update last login date
            let user = {
                lastLoginDate: time.getLatestTimeUTC()
            }
            await this.repository.updateItem(userExist.userName, user, {id: userExist.id});

            let data = {
                id: userExist.id,
                isAdmin: userExist.isAdmin
            }

            let {password, ...rest} = userExist.toJSON()

            return {
                accessToken: token.sign(data, userExist.email),
                refreshToken: token.sign(data, userExist.email, "30 days"),
                user: {
                    fullName: userExist.fullName,
                    ...rest
                }
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.unauthorized(`Authentication Handler`, `Unauthorized.`, err);
        }
    }

    async authorized(id) {
        try {
            let userExist = await this.repository.getById(id, ['id']);
            // Check user is exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");
            return userExist;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`Authentication Handler`, this.table, err);
        }
    }
}

module.exports = AuthenService