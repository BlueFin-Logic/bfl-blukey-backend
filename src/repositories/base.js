const CustomError = require('../common/error');

class BaseRepository {
    constructor(table, models) {
        this.table = table;
        this.tableName = this.table.tableName;
        this.models = models;
    }

    getAll(page, limit, fields, conditions = null) {
        try {
            if (page < 1) page = 1;
            if (limit < 1) limit = 5;
            if (limit > 100) limit = 100;
            const offset = (page - 1) * limit;
            return this.table.findAndCountAll({
                attributes: fields,
                where: conditions,
                offset: offset,
                limit: limit
            });
        } catch (error) {
            throw CustomError.cannotListEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getById(id, fields, include = null) {
        try {
            return this.table.findByPk(id, {
                attributes: fields,
                include: include
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getOne(conditions, fields, include = null) {
        try {
            return this.table.findOne({
                attributes: fields,
                where: conditions,
                include: include
            });
        } catch (error) {
            throw CustomError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getByCondition(conditions, fields, include = null) {
        try {
            return this.table.findAll({
                attributes: fields,
                where: conditions,
                include: include
            });
        } catch (error) {
            throw CustomError.cannotListEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    addItem(data, fields = null) {
        try {
            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            delete data.deletedAt;

            return this.table.create(data, {
                fields: fields,
                validate: true
            });
        } catch (error) {
            throw CustomError.cannotCreateEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    updateItem(data, conditions, fields = null) {
        try {
            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            delete data.deletedAt;

            return this.table.update(data, {
                where: conditions,
                fields: fields,
                validate: true,
                // returning: true
            });
        } catch (error) {
            throw CustomError.cannotUpdateEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
}

module.exports = BaseRepository