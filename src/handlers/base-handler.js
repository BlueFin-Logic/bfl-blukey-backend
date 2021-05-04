const BaseService = require('../services/base-service');
const { BaseModel } = require('../model/table');

class BaseHandler {
    constructor(containerID) {
        this.baseService = new BaseService(containerID);
    }

    async getAll(page, limit) {
        let fields = "*"
        return await this.baseService.getAll(page, limit, fields);
    }

    async getById(data) {
        let fields = "*"
        let condition = `${BaseModel.column_id} = ${data}`
        return await this.baseService.getByCondition(fields, condition);
    }

    async addItem(item) {
        return await this.baseService.addItem(item);
    }

    async updateItem(id, item) {
        return await this.baseService.updateItem(id, item);
    }

    async deleteItem(id) {
        return await this.baseService.deleteItem(id);
    }
}

module.exports = BaseHandler;