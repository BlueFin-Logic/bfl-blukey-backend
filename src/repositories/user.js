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

    addItem(data, transaction = null) {
        data.lastLoginDate = Time.getLatestTimeUTC();
        const fields = ['firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'lastLoginDate', 'isAdmin'];
        return super.addItem(data, fields, transaction);
    }

    updateItem(data, conditions, transaction = null) {
        const fields = ['firstName', 'lastName', 'fullName', 'email', 'address', 'password' ,'lastLoginDate', 'isAdmin'];
        return super.updateItem(data, conditions, fields, transaction);
    }

    deleteItem(conditions, transaction = null) {
        return super.deleteItem(conditions, false, transaction);
    }
}

module.exports = UserRepository