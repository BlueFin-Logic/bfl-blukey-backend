const moment = require('moment');
const lastest_date = moment.utc().format('YYYY-MM-DD hh:mm:ss.SSS');

class BaseModel {
    constructor(created_at = null) {
        this.created_at = created_at === null ? lastest_date : created_at;
        this.updated_at = lastest_date;
    }
    static get column_id() {
        return "[id]";
    }
    static get column_created_at() {
        return "[created_at]";
    }
    static get column_updated_at() {
        return "[updated_at]";
    }
}

class UserModel extends BaseModel {
    constructor(first_name, last_name, email, address, username, password, salt, is_admin, is_deleted, created_at = null) {
        super(created_at)
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.address = address;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.is_admin = is_admin !== null ? Number(is_admin) : null;
        this.is_deleted = is_deleted !== null ? Number(is_deleted) : null;
        this.last_login_date = lastest_date;
    }

    static get tableName() {
        return "[Users]";
    }
    static get column_first_name() {
        return "[first_name]";
    }
    static get column_last_name() {
        return "[last_name]";
    }
    static get column_email() {
        return "[email]";
    }
    static get column_address() {
        return "[address]";
    }
    static get column_username() {
        return "[username]";
    }
    static get column_password() {
        return "[password]";
    }
    static get column_salt() {
        return "[salt]";
    }
    static get column_is_admin() {
        return "[is_admin]";
    }
    static get column_is_deleted() {
        return "[is_deleted]";
    }
    static get column_last_login_date() {
        return "[last_login_date]";
    }
}


module.exports = {
    BaseModel,
    UserModel
}