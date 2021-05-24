class BaseModel {
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

// constructor(created_at = null) {
//     this.created_at = created_at === null ? lastest_date : created_at;
//     this.updated_at = lastest_date;
// }