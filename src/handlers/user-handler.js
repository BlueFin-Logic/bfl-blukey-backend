const BaseHandler = require('./base-handler');
const CustomError = require('../response_error/error');
const {Utilities} = require('../common/utilities');
const UserModel = require('../model/user');
const TABLE_USER = UserModel.tableName;

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
                            ${UserModel.username},
                            ${UserModel.is_admin}`;
            let conditions = `${UserModel.is_deleted} = '0'`;
            // let users = await this.service.getAll(page, limit, fields, conditions);
            let [users, countRecord] = await Promise.all([
                                                this.service.getAll(page, limit, fields, conditions),
                                                this.service.countTotalRecord()
                                            ]);
            users.total = countRecord.total;
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
            let condition = `${UserModel.id} = @id AND ${UserModel.is_deleted} = 0`;
            let user = await this.service.getByCondition(fields, condition, {id: data});
            // Check user is exist.
            if (Utilities.isEmpty(user)) throw CustomError.badRequest(`${this.table} Handler`, "User is not found!");
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async addItem(data, hash) {
        try {
            let fields = `${UserModel.id}`;
            let condition = `${UserModel.email} = @email AND ${UserModel.is_deleted} = 0`;

            let userExist = await this.service.getByCondition(fields, condition, data);

            if (!Utilities.isEmpty(userExist)) throw CustomError.badRequest(`${this.table} Handler`, "Email already exist!");

            data.salt = hash.genSalt(15);
            data.password = hash.hashMD5(data.password + data.salt);

            let createdUser = await this.service.addItem(data);
            return createdUser;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async updateItem(id, data, hash) {
        try {
            let fields = `${UserModel.id},
                            ${UserModel.password}, 
                            ${UserModel.salt}`;
            let condition = `${UserModel.id} = @id AND ${UserModel.is_deleted} = 0`;
            let userExist = await this.service.getByCondition(fields, condition, {id: id});

            if (Utilities.isEmpty(userExist)) throw CustomError.badRequest(`${this.table} Handler`, "User not exist!");

            if (data.old_password) {
                if (data.password && userExist.password === hash.hashMD5(data.old_password + userExist.salt)) {
                    data.salt = hash.genSalt(15);
                    data.password = hash.hashMD5(data.password + data.salt);
                } else {
                    throw CustomError.badRequest(`${this.table} Handler`, "Password is not correct!");
                }
            } else {
                data.password = null;
            }

            let updatedUser = await this.service.updateItem(id, data);
            return updatedUser;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async deleteItem(id) {
        try {
            let fields = `${UserModel.id}`;
            let condition = `${UserModel.id} = @id AND ${UserModel.is_deleted} = 0`;
            let userExist = await this.service.getByCondition(fields, condition, {id: id});

            if (Utilities.isEmpty(userExist)) throw CustomError.badRequest(`${this.table} Handler`, "User not exist!");
            let data = {
                "is_deleted": true
            };
            let user = await this.service.updateItem(id, data);
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotDeleteEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async ping(appContext) {
        return await this.userService.ping(appContext);
    }
}

module.exports = UserHandler;