const { Time } = require('../common/time');
const lastest_date = Time.getLatestTime;
// const moment = require('moment');
// const lastest_date = moment.utc().format('YYYY-MM-DD hh:mm:ss.SSS');

class BaseModel {
    constructor(created_at = null) {
        this.created_at = created_at === null ? lastest_date : created_at;
        this.updated_at = lastest_date;
    }
    static get id() {
        return "[id]";
    }
    static get created_at() {
        return "[created_at]";
    }
    static get updated_at() {
        return "[updated_at]";
    }
}

module.exports = BaseModel