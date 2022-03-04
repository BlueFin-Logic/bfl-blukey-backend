const BaseRepository = require('./base');
const fields = ['userId', 'table', 'action', 'dataBefore', 'dataAfter'];

class LoggingDbRepository extends BaseRepository {
    constructor(models) {
        super(models.LoggingDb, models);
    }

    async addItem(userId, table, dataAfter, transaction = null) {
        try {
            const data = {
                userId: userId,
                table: table,
                action: "CREATE",
                dataBefore: null,
                dataAfter: JSON.stringify(dataAfter.toJSON()),
            };
            return await super.addItem(data, fields, transaction);
        } catch (error) {
            console.log(`Error when writing log create record with table ${table}: ${error}`);
            return null;
        }
    }

    async updateItem(userId, table, dataBefore, dataAfter, transaction = null) {
        try {
            const data = {
                userId: userId,
                table: table,
                action: "UPDATE",
                dataBefore: JSON.stringify(dataBefore.toJSON()),
                dataAfter: JSON.stringify(dataAfter.toJSON()),
            };
            return await super.addItem(data, fields, transaction);
        } catch (error) {
            console.log(`Error when writing log update record with table ${table}: ${error}`);
            return null;
        }
    }

    async deleteSoftItem(userId, table, dataBefore, dataAfter = null, transaction = null) {
        try {
            const data = {
                userId: userId,
                table: table,
                action: "DELETESOFT",
                dataBefore: JSON.stringify(dataBefore.toJSON()),
                dataAfter: JSON.stringify(dataAfter),
            };
            return await super.addItem(data, fields, transaction);
        } catch (error) {
            console.log(`Error when writing log delete soft record with table ${table}: ${error}`);
            return null;
        }
    }

    async restoreItem(userId, table, dataBefore, dataAfter = null, transaction = null) {
        try {
            const data = {
                userId: userId,
                table: table,
                action: "RESTORE",
                dataBefore: JSON.stringify(dataBefore.toJSON()),
                dataAfter: JSON.stringify(dataAfter),
            };
            return await super.addItem(data, fields, transaction);
        } catch (error) {
            console.log(`Error when writing log restore record with table ${table}: ${error}`);
            return null;
        }
    }

    async deleteHardItem(userId, table, dataBefore, transaction = null) {
        try {
            const data = {
                userId: userId,
                table: table,
                action: "DELETE",
                dataBefore: JSON.stringify(dataBefore.toJSON()),
                dataAfter: null,
            };
            return await super.addItem(data, fields, transaction);
        } catch (error) {
            console.log(`Error when writing log delete record with table ${table}: ${error}`);
            return null;
        }
    }
}

module.exports = LoggingDbRepository