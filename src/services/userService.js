const BaseService = require('./baseService');
const UserRepository = require('../repositories/userRepository');
const { TABLE_USER } = require('../common/table');

class UserService extends BaseService {
    constructor() {
        super(TABLE_USER);
        this.userRepository = new UserRepository();
    }
}

module.exports = UserService;