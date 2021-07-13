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
            let username = item.userName;
            let password = item.password;

            let fields = ['id', 'firstName', 'lastName', 'email', 'address', 'userName', 'password', 'isAdmin','lastLoginDate'];
            let userExist = await this.repository.getOne({userName: username}, fields);

            // Check user is exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");

            // Check user correct pass.
            if (userExist.password !== hash.hashPassword(userExist.userName, password)) throw CustomError.badRequest(`Authentication Handler`, "Invalid password!");

            // Update last login date
            let user = {
                lastLoginDate: time.getLatestTimeUTC()
            }
            await this.repository.updateItem(userExist.userName, user, {id: userExist.id});

            let data = {
                id: userExist.id,
                isAdmin: userExist.isAdmin
            }

            return {
                accessToken: token.sign(data, userExist.email),
                refreshToken: token.sign(data, userExist.email, "30 days"),
                user: {
                    id: userExist.id,
                    firstName: userExist.firstName,
                    lastName: userExist.lastName,
                    fullName: userExist.fullName,
                    email: userExist.email,
                    address: userExist.address,
                    userName: userExist.userName,
                    isAdmin: userExist.isAdmin,
                    lastLoginDate: user.lastLoginDate
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