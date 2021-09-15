const BaseRepository = require('./base');
const fields = ['userId', 'table', 'action', 'dataBefore', 'dataAfter'];

class LoggingDbRepository extends BaseRepository {
    constructor(models) {
        super(models.LoggingDb, models);
    }

    addItem(userId, table, dataAfter, transaction = null) {
        const data = {
            userId: userId,
            table: table,
            action: "CREATE",
            dataBefore: null,
            dataAfter: JSON.stringify(dataAfter.toJSON()),
        };
        return super.addItem(data, fields, transaction);
    }

    updateItem(userId, table, dataBefore, dataAfter, transaction = null) {
        const data = {
            userId: userId,
            table: table,
            action: "UPDATE",
            dataBefore: JSON.stringify(dataBefore.toJSON()),
            dataAfter: JSON.stringify(dataAfter.toJSON()),
        };
        return super.addItem(data, fields, transaction);
    }

    deleteSoftItem(userId, table, dataBefore, dataAfter, transaction = null) {
        const data = {
            userId: userId,
            table: table,
            action: "DELETESOFT",
            dataBefore: JSON.stringify(dataBefore.toJSON()),
            dataAfter: dataAfter,
        };
        return super.addItem(data, fields, transaction);
    }

    deleteHardItem(userId, table, dataBefore, transaction = null) {
        const data = {
            userId: userId,
            table: table,
            action: "DELETEHARD",
            dataBefore: JSON.stringify(dataBefore.toJSON()),
            dataAfter: null,
        };
        return super.addItem(data, fields, transaction);
    }
}

module.exports = LoggingDbRepository