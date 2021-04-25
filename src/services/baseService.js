const BaseRepository = require('../repositories/baseRepository');

class BaseService {
    constructor(containerID) {
        this.baseRepository = new BaseRepository(containerID);
    }

    async getAll(page, limit) {
        return await this.baseRepository.getAll(page, limit);
    }

    async getById(id) {
        return await this.baseRepository.getById(id);
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