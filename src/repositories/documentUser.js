const BaseRepository = require('./base');
const MyError = require('../common/error');
const defaultFields = ['id', 'container', 'folder', 'fileName', 'userId', 'updatedAt'];

class DocumentUserRepository extends BaseRepository {
    constructor(models) {
        super(models.DocumentUser, models);
    }

    addItem(data, transaction = null) {
        return super.addItem(data, defaultFields, transaction);
    }

    deleteItem(conditions, transaction = null) {
        return super.deleteItem(conditions, true, transaction);
    }

    getById(id, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields, include, true)
    }

    getByCondition(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        const order = [
            ['updatedAt', 'DESC']
        ]
        return super.getByCondition(conditions, fields, include, order)
    }
}
module.exports = DocumentUserRepository