const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['id', 'container', 'folder', 'fileName', 'updatedAt'];

class DocumentUserRepository extends BaseRepository {
    constructor(models) {
        super(models.DocumentUser, models);
    }

    getByCondition(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getByCondition(conditions, fields, include)
    }
}
module.exports = DocumentUserRepository