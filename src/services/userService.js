const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const { HashService } = require('../common/hash');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');
const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST } = require('../common/statusResponse')

class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }

    async getAll(page, limit) {
        return await this.userRepository.getAll(page, limit);
    }

    async addItem(item) {
        try {
            let user = await this.userRepository.getByEmail(item.email);
            if (!Utilities.isEmpty(user)) return { message: "Email already exist!" }

            let salt = await HashService.genSalt(15);

            let passwordHash = HashService.hashMD5(item.password + salt);

            item.salt = salt;
            item.password = passwordHash;

            return await this.userRepository.addItem(item);
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserService;