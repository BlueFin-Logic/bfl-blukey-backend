const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');

class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }

    async getAll(page, limit) {
        return await this.userRepository.getAll(page, limit);
    }

    async addItem(item) {
        let user = await this.userRepository.getByEmail(item.email);
        if (!Utilities.isEmpty(user)) return { message: "Email already exist!" }

        let salt =  await bcrypt.genSalt(15);
        let passwordHash =  await bcrypt.hash(item.password, salt)
        
        item.salt = salt;
        item.password = passwordHash;

        return await this.userRepository.addItem(item);
    }
}

module.exports = UserService;