const sql = require('mssql');
const BaseRepository = require('./baseRepository');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');

class UserRepository extends BaseRepository {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

    async getAll(page, limit) {
        try {
            let result = await super.getAll(page, limit);
            return Utilities.responsePaging(result, Utilities.parseInt(page, 0), Utilities.parseInt(result.length, 0));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

module.exports = UserRepository;