const sql = require('mssql');
const BaseRepository = require('./baseRepository');
const { Utilities } = require('../common/utilities');
const { TABLE_USER } = require('../common/table');

class UserRepository extends BaseRepository {
    constructor() {
        super(TABLE_USER);
        this.table = TABLE_USER;
    }

    async getByFilter(display, device_model) {

        try {
            display = Utilities.isEmpty(display) ? "*" : display;
            device_model = Utilities.isEmpty(device_model) ? "" : device_model;//expected values template: 1,2,3,4

            await sql.connect(this.connectString);

            const request = new sql.Request();
            request.input('device_model', sql.NVarChar, device_model);
            let result = await request.query(`SELECT ${display} 
                                              FROM ${this.table} 
                                              WHERE @device_model = '' OR EXISTS (SELECT 1 FROM dbo.fnSplitString(@device_model,',') WHERE device_model = Item)`);

            let data = result.recordsets[0];

            if (data) {
                handleData(data);
            }

            return data;

        } catch (err) {
            console.error(err);
            return null;
        }
    }
}

function handleData(data) {
    if (data) {
        if (Array.isArray(data)) {
            data.forEach(item => {
                handleItemData(item);
            });
        }
        else {
            handleItemData(data);
        }
    }
}

function handleItemData(data) {
    if (data) {
        data.configuration = Utilities.parseJSON(data.configuration, data.configuration);
    }
}
module.exports = UserRepository;