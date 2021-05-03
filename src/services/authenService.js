const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const { HashService } = require('../common/hash');
const { TokenService } = require('../common/token');
const { Utilities } = require('../common/utilities');
const { UserModel } = require('../model/table');
const TABLE_USER = UserModel.tableName

class AuthenService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }

    async login(item) {
        try {
            let email = item.email;
            let password = item.password;

            let fields = `${UserModel.column_id},${UserModel.column_salt},${UserModel.column_password},${UserModel.column_is_admin}`;
            let condition = `${UserModel.column_email} = '${item.email}'`;
            
            let user = await this.userRepository.getByCondition(fields, condition);

            if (Utilities.isEmpty(user)) return "Email is not found!"
            let passwordHash = HashService.hashMD5(password + user.salt)
            if (passwordHash !== user.password) return "Invalid password."
            let data = {
                id: user.id,
                is_admin: user.is_admin
            }
            let token = TokenService.sign(data, email);
            return token
        } catch (error) {
            throw error
        }
    }
}

module.exports = AuthenService;