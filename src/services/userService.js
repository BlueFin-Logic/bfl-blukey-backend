const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const { TABLE_USER } = require('../common/table');

class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }

    async getAll(page, limit) {
        return await this.userRepository.getAll(page, limit);
    }
}

module.exports = UserService;