const BaseModel = require('./base');
const ObjectMapper = require('../common/object-mapper');

class DocumentModel extends BaseModel {
    static cleanJsonCreate(data) {
        let schema = {
            "container": "container",
            "file_name": "file_name",
            "user_id": "user_id",
            "is_deleted": "is_deleted",
            "created_at": "created_at",
            "updated_at": "updated_at"
        }
        return ObjectMapper.map(data, schema);
    }

    static cleanJsonUpdate(data) {
        let schema = {
            "is_deleted": "is_deleted",
            "updated_at": "updated_at"
        }
        return ObjectMapper.map(data, schema);
    }

    static get tableName() {
        return "[Documents]";
    }

    static get container() {
        return "[container]";
    }

    static get file_name() {
        return "[file_name]";
    }

    static get user_id() {
        return "[user_id]";
    }

    static get is_deleted() {
        return "[is_deleted]";
    }
}

module.exports = DocumentModel