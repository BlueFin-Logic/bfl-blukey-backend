const BaseHandler = require('./base-handler');
const CustomError = require('../response_error/error');
const { Utilities } = require('../common/utilities');
const UserModel = require('../model/user');
const TABLE_USER = UserModel.tableName;
const { Time } = require('../common/time');

class UserHandler extends BaseHandler {
    constructor(service) {
        super(service, TABLE_USER);
    }

    async getAll(page, limit) {
        try {
            let fields = `${UserModel.id},
                            ${UserModel.first_name},
                            ${UserModel.last_name},
                            ${UserModel.email},
                            ${UserModel.address},
                            ${UserModel.username}`;
            let conditions = `${UserModel.is_deleted} = '0'`;
            let users = await this.service.getAll(page, limit, fields, conditions);
            return users;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async getById(data) {
        try {
            let fields = `${UserModel.id},
                            ${UserModel.first_name},
                            ${UserModel.last_name},
                            ${UserModel.email},
                            ${UserModel.address},
                            ${UserModel.username},
                            ${UserModel.is_admin}`;
            let condition = `${UserModel.id} = ${data} AND ${UserModel.is_deleted} = 0`;
            let user = await this.service.getByCondition(fields, condition);
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async addItem(data, hash) {
        try {
            let fields = `${UserModel.id}`;
            let condition = `${UserModel.email} = '${data.email}' AND ${UserModel.is_deleted} = 0`;

            let userExist = await this.service.getByCondition(fields, condition);

            if (!Utilities.isEmpty(userExist)) throw CustomError.badRequest(`${this.table} Handler`, "Email already exist!");

            let salt = hash.genSalt(15);
            let passwordHash = hash.hashMD5(data.password + salt);

            let user = new UserModel(
                data.first_name,
                data.last_name,
                data.email,
                data.address,
                data.username,
                passwordHash,
                salt,
                data.is_admin,
                data.is_deleted,
            );

            let createdUser = await this.service.addItem(user);
            return createdUser;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async updateItem(id, data, hash) {
        try {
            let fields = `${UserModel.id}, ${UserModel.created_at}, ${UserModel.last_login_date}`;
            let condition = `${UserModel.id} = ${id} AND ${UserModel.is_deleted} = 0`;
            let userExist = await this.service.getByCondition(fields, condition);

            if (Utilities.isEmpty(userExist)) throw CustomError.badRequest(`${this.table} Handler`, "User not exist!");

            let salt = hash.genSalt(15);
            let passwordHash = hash.hashMD5(data.password + salt);

            let user = new UserModel(
                data.first_name,
                data.last_name,
                data.email,
                data.address,
                data.username,
                passwordHash,
                salt,
                data.is_admin,
                data.is_deleted,
                Time.formatTimeToString(userExist.created_at),
                Time.formatTimeToString(userExist.last_login_date)
            );

            let updatedUser = await this.service.updateItem(id, user);
            return updatedUser;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async ping(appContext) {
        return await this.userService.ping(appContext);
    }
}

module.exports = UserHandler;