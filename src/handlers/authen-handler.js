const BaseHandler = require('./base-handler');
const CustomError = require('../response_error/error');
const {Utilities} = require('../common/utilities');
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

            if (Utilities.isEmpty(userExist)) throw CustomError.badRequest(`${this.table} Handler`, "Username not found!");

            if (userExist.password !== hash.hashMD5(password + userExist.salt)) throw CustomError.badRequest(`${this.table} Handler`, "Invalid password!");

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
            throw CustomError.unauthorized(`Authen Handler`, `Unauthorized`, err);
        }
    }
}

module.exports = AuthenHandler;