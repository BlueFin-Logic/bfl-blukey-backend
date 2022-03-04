const BaseRepository = require('./base');

class SessionRepository extends BaseRepository {
    constructor(models) {
        super(models.Session, models);
    }

    addItem(userId, token, transaction = null) {
        const fields = ['userId', 'token'];
        const data = {
            userId: userId,
            token: token
        };
        return super.addItem(data, fields, transaction);
    }

    updateItem(userId, token, transaction = null) {
        const fields = ['token'];
        const data = { token: token };
        const condition = { userId: userId };
        return super.updateItem(data, condition, fields, transaction);
    }

    getOne(userId, token) {
        const fields = ['id', 'userId', 'token', 'createdAt'];
        const condition = {};
        if (userId) condition.userId = userId;
        if (token) condition.token = token;
        return super.getOne(condition, fields);
    }

    deleteItem(userId, transaction = null) {
        const condition = { userId: userId };
        return super.deleteItem(condition, true, transaction);
    }
}

module.exports = SessionRepository