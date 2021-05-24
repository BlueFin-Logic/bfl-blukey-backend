const CustomError = require('../response_error/error');
const BaseModel = require('../model/base');

class BaseHandler {
    constructor(service, table) {
        this.service = service;
        this.table = table;
    }

    async getAll(page, limit) {
        try {
            let fields = "*";
            let users = await this.service.getAll(page, limit, fields);
            return users;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async getById(data) {
        try {
            let fields = "*";
            let condition = `${BaseModel.id} = ${data}`;
            let user = await this.service.getByCondition(fields, condition);
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async addItem(data) {
        try {
            let user = await this.service.addItem(data);
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async updateItem(id, data) {
        try {
            let user = await this.service.updateItem(id, data);
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.table} Handler`, this.table, err);
        }
    }

    async deleteItem(id) {
        try {
            let data = {
                "is_deleted": true
            };
            let user = await this.service.updateItem(id, data);
            return user;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotDeleteEntity(`${this.table} Handler`, this.table, err);
        }
    }
}

module.exports = BaseHandler;