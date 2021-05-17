const BaseModel = require('./base');
const { Time } = require('../common/time');
const lastest_date = Time.getLatestTime;
// const moment = require('moment');
// const lastest_date = moment.utc().format('YYYY-MM-DD hh:mm:ss.SSS');

class UserModel extends BaseModel {
    constructor(first_name, last_name, email, address, username, password, salt, is_admin, is_deleted, created_at = null, last_login_date) {
        super(created_at)
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.address = address;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.is_admin = is_admin ? Number(is_admin) : null;
        this.is_deleted = is_deleted ? Number(is_deleted) : null;
        this.last_login_date = last_login_date ? last_login_date : lastest_date;
    }

    static get tableName() {
        return "[Users]";
    }
    static get first_name() {
        return "[first_name]";
    }
    static get last_name() {
        return "[last_name]";
    }
    static get email() {
        return "[email]";
    }
    static get address() {
        return "[address]";
    }
    static get username() {
        return "[username]";
    }
    static get password() {
        return "[password]";
    }
    static get salt() {
        return "[salt]";
    }
    static get is_admin() {
        return "[is_admin]";
    }
    static get is_deleted() {
        return "[is_deleted]";
    }
    static get last_login_date() {
        return "[last_login_date]";
    }
}


module.exports = UserModel