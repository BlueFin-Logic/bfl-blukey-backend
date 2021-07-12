const CustomError = require('../common/error');

class BaseService {
    constructor(repository) {
        this.repository = repository;
        this.tableName = this.repository.tableName;
    }
}

module.exports = BaseService