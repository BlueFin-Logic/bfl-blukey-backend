const BaseRepository = require('./base');
const CustomError = require('../common/error');
const defaultFields = ['id', 'name','isRequired'];

class DocumentTypeRepository extends BaseRepository {
    constructor(models) {
        super(models.DocumentType, models);
    }

    getByCondition(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getByCondition(conditions, fields, include)
    }
}
module.exports = DocumentTypeRepository