const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['id', 'firstName', 'lastName', 'email', 'address', 'userName', 'lastLoginDate', 'updatedAt'];
const time = require('../helper/time');

class UserRepository extends BaseRepository {
    constructor(models) {
        super(models.User, models);
    }

    getAll(page, limit, conditions = null) {
        let fields = defaultFields;
        fields.push('isAdmin');
        return super.getAll(page, limit, fields, conditions);
    }

    getById(id, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields, include);
    }

    getOne(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include);
    }

    addItem(data, fields = null) {
        data.lastLoginDate = time.getLatestTimeUTC();
        return super.addItem(data, fields);
    }

    updateItem(userName, data, conditions, fields = null) {
        data.userName = userName; // for hash pass
        return super.updateItem(data, conditions, fields);
    }
}

module.exports = UserRepository