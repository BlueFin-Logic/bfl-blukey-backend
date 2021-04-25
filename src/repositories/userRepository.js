const sql = require('mssql');
const BaseRepository = require('./baseRepository');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');

class UserRepository extends BaseRepository {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

}

module.exports = UserRepository;