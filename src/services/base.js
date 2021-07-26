class BaseService {
    constructor(repository, currentUser) {
        this.repository = repository;
        this.tableName = this.repository.tableName;
        this.currentUser = currentUser;
    }
}

module.exports = BaseService