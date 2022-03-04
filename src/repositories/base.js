const MyError = require('../common/error');

class BaseRepository {
    constructor(table, models) {
        this.table = table;
        this.tableName = this.table.tableName;
        this.models = models;
    }

    getAll(page, limit, fields, conditions = null, include = null, paranoid = true, order = [], distinct = false) {
        try {
            if (page < 1) page = 1;
            if (limit < 1) limit = 5;
            if (limit > 100) limit = 100;
            const offset = (page - 1) * limit;
            if (order.length === 0) {
                order = [
                    ['updatedAt', 'DESC'],
                ]
            }
            return this.table.findAndCountAll({
                attributes: fields,
                where: conditions,
                include: include,
                paranoid: paranoid,
                offset: offset,
                limit: limit,
                order: order,
                distinct: distinct,
                // logging: (sql, timing, queryObject) => console.log({
                //     sql: sql,
                //     timing: timing,
                //     queryObject: queryObject
                // }),
            });
        } catch (error) {
            throw MyError.cannotListEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getById(id, fields, include = null, paranoid = true) {
        try {
            return this.table.findByPk(id, {
                attributes: fields,
                include: include,
                paranoid: paranoid
            });
        } catch (error) {
            throw MyError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getOne(conditions, fields, include = null, paranoid = true) {
        try {
            return this.table.findOne({
                attributes: fields,
                where: conditions,
                include: include,
                paranoid: paranoid
            });
        } catch (error) {
            throw MyError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    getByCondition(conditions, fields, include = null, order = null, paranoid = true, group = null) {
        try {
            return this.table.findAll({
                attributes: fields,
                where: conditions,
                include: include,
                order: order,
                paranoid: paranoid,
                group: group
            });
        } catch (error) {
            throw MyError.cannotListEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    addItem(data, fields = null, transaction = null) {
        try {
            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            delete data.deletedAt;
            delete data.deactivatedAt;

            return this.table.create(data, {
                fields: fields,
                validate: true,
                transaction: transaction
            });
        } catch (error) {
            throw MyError.cannotCreateEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    // buildItem(data, raw = false) {
    //     try {
    //         delete data.id;
    //         delete data.createdAt;
    //         delete data.updatedAt;
    //         delete data.deletedAt;
    //         delete data.deactivatedAt;

    //         return this.table.build(data, {
    //             raw: raw
    //         });
    //     } catch (error) {
    //         throw MyError.cannotCreateEntity(`${this.tableName} Repository`, this.tableName, error);
    //     }
    // }

    // saveItem(instance, conditions, fields = null, transaction = null) {
    //     try {
    //         return instance.save({
    //             where: conditions,
    //             fields: fields,
    //             validate: true,
    //             transaction: transaction
    //         });
    //     } catch (error) {
    //         throw MyError.cannotUpdateEntity(`${this.tableName} Repository`, this.tableName, error);
    //     }
    // }

    updateItem(data, conditions, fields = null, transaction = null) {
        try {
            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            delete data.deletedAt;

            return this.table.update(data, {
                where: conditions,
                fields: fields,
                validate: true,
                transaction: transaction
            });
        } catch (error) {
            throw MyError.cannotUpdateEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    countItem(conditions) {
        try {
            return this.table.count(conditions);
        } catch (error) {
            throw MyError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    deleteItem(conditions, hard = false, transaction = null) {
        try {
            return this.table.destroy({
                where: conditions,
                force: hard,
                transaction: transaction
            });;
        } catch (error) {
            throw MyError.cannotDeleteEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }

    restoreItem(conditions, transaction = null) {
        try {
            return this.table.restore({
                where: conditions,
                transaction: transaction
            });;
        } catch (error) {
            throw MyError.cannotRestoreEntity(`${this.tableName} Repository`, this.tableName, error);
        }
    }
}

module.exports = BaseRepository