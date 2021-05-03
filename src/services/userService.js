const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const { HashService } = require('../common/hash');
const { Utilities } = require('../common/utilities');
const { UserModel } = require('../model/table');
// const { TABLE_USER } = require('../common/table');
const TABLE_USER = UserModel.tableName;

class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }

    async getAll(page, limit) {
        try {
            let fields = `${UserModel.column_id},
                                ${UserModel.column_first_name},
                                ${UserModel.column_last_name},
                                ${UserModel.column_email},
                                ${UserModel.column_address},
                                ${UserModel.column_username}`;
            let result = await this.userRepository.getAll(page, limit, fields);
            return Utilities.responsePaging(result, Utilities.parseInt(page, 0), Utilities.parseInt(result.length, 0));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getById(data) {
        try {
            let fields = `${UserModel.column_id},
                        ${UserModel.column_first_name},
                        ${UserModel.column_last_name},
                        ${UserModel.column_email},
                        ${UserModel.column_address},
                        ${UserModel.column_username},
                        ${UserModel.column_is_admin}`;
            let condition = `${UserModel.column_id} = ${data} AND ${UserModel.column_is_deleted} = 0`;
            return await this.userRepository.getByCondition(fields, condition);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async addItem(item) {
        try {
            let fields = `${UserModel.column_id}`;
            let condition = `${UserModel.column_email} = '${item.email}'`;

            let user = await this.userRepository.getByCondition(fields, condition);

            if (!Utilities.isEmpty(user)) return { message: "Email already exist!" }

            let salt = await HashService.genSalt(15);
            let passwordHash = HashService.hashMD5(item.password + salt);

            let data = new UserModel(
                item.first_name,
                item.last_name,
                item.email,
                item.address,
                item.username,
                passwordHash,
                salt,
                item.is_admin,
                item.is_deleted,
            );

            return await this.userRepository.addItem(data);
        } catch (error) {
            throw error
        }
    }

    async ping() {
        return await this.userRepository.ping();
    }
}

module.exports = UserService;