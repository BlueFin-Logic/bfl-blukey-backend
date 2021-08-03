const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'isAdmin', 'lastLoginDate', 'updatedAt'];
const Time = require('../helper/time');

class UserRepository extends BaseRepository {
    constructor(models) {
        super(models.User, models);
    }

    getAll(page, limit, fields = null, conditions = null, include = null) {
        if (!fields){
            fields = defaultFields;
        } else {
            fields = fields.filter(field => defaultFields.some(defaultField => defaultField === field));
        }
        return super.getAll(page, limit, fields, conditions, include, false);
    }

    getById(id, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields, include, false);
    }

    getOne(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include);
    }

    addItem(data) {
        data.lastLoginDate = Time.getLatestTimeUTC();
        const fields = ['firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate'];
        return super.addItem(data, fields);
    }

    updateItem(userName, data, conditions) {
        data.userName = userName; // for hash pass
        const fields = ['firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password' ,'lastLoginDate', 'isAdmin'];
        return super.updateItem(data, conditions, fields);
    }

    deleteItem(conditions) {
        return super.deleteItem(conditions, false);
    }
}

module.exports = UserRepository