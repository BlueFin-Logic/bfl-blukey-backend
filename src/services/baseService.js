const BaseRepository = require('../repositories/baseRepository');
const { BaseModel } = require('../model/table');

class BaseService {
    constructor(containerID) {
        this.baseRepository = new BaseRepository(containerID);
    }

    async getAll(page, limit) {
        let fields = "*"
        return await this.baseRepository.getAll(page, limit, fields);
    }

    async getById(data) {
        let fields = "*"
        let condition = `${BaseModel.column_id} = ${data}`
        return await this.baseRepository.getByCondition(fields, condition);
    }

    async addItem(item) {
        return await this.baseRepository.addItem(item);
    }

    async updateItem(id, item) {
        return await this.baseRepository.updateItem(id, item);
    }

    async deleteItem(id) {
        return await this.baseRepository.deleteItem(id);
    }
}

module.exports = BaseService;