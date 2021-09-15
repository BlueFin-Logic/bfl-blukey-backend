// const BaseService = require('../services/base');
const CustomError = require('../common/error');
const Hash = require('../helper/hash');
const Time = require('../helper/time');

class AuthenService {
    constructor(repository) {
        this.repository = repository;
        this.tableName = this.repository.tableName;
    }

    async login(item, token) {
        try {
            const {
                userName: itemUserName,
                password: itemPassword
            } = item;

            const fields = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate'];
            const userExist = await this.repository.getOne({userName: itemUserName.toLowerCase()}, fields);

            // Check user is exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Service`, "User is not found!");

            // Check user correct pass.
            if (!await Hash.compareHash(itemPassword, userExist.password)) throw CustomError.badRequest(`Authentication Service`, "Invalid password!");

            // Update last login date
            const user = {
                lastLoginDate: Time.getLatestTimeUTC()
            }
            await this.repository.updateItem(userExist.userName, user, {id: userExist.id});

            let data = {
                id: userExist.id,
                isAdmin: userExist.isAdmin
            }

            const {password, lastLoginDate, ...rest} = userExist.toJSON();

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
            throw CustomError.unauthorized(`Authentication Service`, `Unauthorized.`, err);
        }
    }

    async authorized(id) {
        try {
            const userExist = await this.repository.getById(id, ['id', 'isAdmin']);
            // Check user is not exist.
            if (!userExist) throw CustomError.badRequest(`Authentication Service`, "User is not found!");
            return userExist;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`Authentication Service`, this.tableName, err);
        }
    }
}

module.exports = AuthenService