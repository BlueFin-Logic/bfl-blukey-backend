// const BaseService = require('../services/base');
const CustomError = require('../common/error');
const hash = require('../helper/hash');
const Time = require('../helper/time');

class AuthenService {
    constructor(repository) {
        this.repository = repository;
        this.tableName = this.repository.tableName;
    }

    async login(item, token) {
        try {
            let itemUserName = item.userName;
            let itemPassword = item.password;

            let fields = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate'];
            let userExist = await this.repository.getOne({userName: itemUserName}, fields);

            // Check user is exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");

            // Check user correct pass.
            if (userExist.password !== hash.hashPassword(userExist.userName, itemPassword)) throw CustomError.badRequest(`Authentication Handler`, "Invalid password!");

            // Update last login date
            let user = {
                lastLoginDate: Time.getLatestTimeUTC()
            }
            await this.repository.updateItem(userExist.userName, user, {id: userExist.id});

            let data = {
                id: userExist.id,
                isAdmin: userExist.isAdmin
            }

            let {password, lastLoginDate, ...rest} = userExist.toJSON()

            return {
                accessToken: token.sign(data, userExist.email),
                refreshToken: token.sign(data, userExist.email, "30 days"),
                user: {
                    lastLoginDate: user.lastLoginDate,
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
            let userExist = await this.repository.getById(id, ['id', 'isAdmin']);
            // Check user is not exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");
            return userExist;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`Authentication Handler`, this.tableName, err);
        }
    }
}

module.exports = AuthenService