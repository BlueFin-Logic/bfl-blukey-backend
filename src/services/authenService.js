const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const { HashService } = require('../common/hash');
const { TokenService } = require('../common/token');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');
const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST } = require('../common/statusResponse')

class AuthenService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }

    async login(item) {
        try {
            let email = item.email;
            let password = item.password;
            let user = await this.userRepository.getByEmail(email);
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