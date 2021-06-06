const BaseHandler = require('./base-handler');
const CustomError = require('../response_error/error');
const {Time} = require('../common/time');
const UserModel = require('../model/user');
const TABLE_USER = UserModel.tableName

class AuthenHandler extends BaseHandler {
    constructor(service) {
        super(service, TABLE_USER);
    }

    async login(item, token, hash) {
        try {
            let username = item.username;
            let password = item.password;

            let fields = `${UserModel.id},
                            ${UserModel.email}, 
                            ${UserModel.password}, 
                            ${UserModel.salt}, 
                            ${UserModel.is_admin}`;
            let condition = `${UserModel.username} = @username AND ${UserModel.is_deleted} = 0`;

            let userExist = await this.service.getByCondition(fields, condition, {username: username});
            
            // Check user is exist.
            if (userExist.length === 0) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");

            userExist = userExist[0]

            if (userExist.password !== hash.hashMD5(password + userExist.salt)) throw CustomError.badRequest(`Authentication Handler`, "Invalid password!");

            // Update last login date
            let user = {
                last_login_date: Time.getLatestTime
            }

            await this.service.updateItem(userExist.id, user);

            let data = {
                id: userExist.id,
                is_admin: userExist.is_admin
            }

            return {
                access_token: token.sign(data, userExist.email),
                refresh_token: token.sign(data, userExist.email, "30 days")
            }
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.unauthorized(`Authentication Handler`, `Unauthorized.`, err);
        }
    }

    async authorized(data) {
        try {
            let fields = `${UserModel.id}`;
            let condition = `${UserModel.id} = @id AND ${UserModel.is_deleted} = 0`;
            let user = await this.service.getByCondition(fields, condition, {id: data});
            // Check user is exist.
            if (user.length === 0) throw CustomError.badRequest(`Authentication Handler`, "User is not found!");
            return user[0];
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotGetEntity(`Authentication Handler`, this.table, err);
        }
    }
}

module.exports = AuthenHandler;