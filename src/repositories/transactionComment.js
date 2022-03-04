const BaseRepository = require('./base');
const MyError = require('../common/error');
const defaultFields = ['id', 'transactionId', 'userId', 'comment', 'isEdited', 'createdAt', 'updatedAt', 'deletedAt'];

class TransactionCommentRepository extends BaseRepository {
    constructor(models) {
        super(models.TransactionComment, models);
    }

    getByCondition(conditions, fields = null) {
        if (!fields) fields = defaultFields;
        const order = [
            ['createdAt', 'DESC']
        ];
        const include = {
            model: this.models.User,
            as: "user",
            attributes: ['firstName', 'lastName']
        };
        return super.getByCondition(conditions, fields, include, order, false);
    }

    getOne(conditions, fields = null, include = null, paranoid = true) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include, paranoid);
    }

    addItem(data, transaction = null) {
        const fields = ['transactionId', 'userId', 'comment'];
        return super.addItem(data, fields, transaction);
    }

    updateItem(data, conditions, transaction = null) {
        data.isEdited = 1;
        const fields = ['comment', 'isEdited'];
        return super.updateItem(data, conditions, fields, transaction);
    }

    deleteItem(conditions, transaction = null) {
        return super.deleteItem(conditions, false, transaction);
    }

    getTransactionInfo(transactionId, userId) {
        try {
            return this.models.Transaction.findOne({
                attributes: ['id', 'userId'],
                where: {
                    id: transactionId,
                    userId: userId
                }
            });
        } catch (error) {
            throw MyError.cannotGetEntity(`${this.tableName} Repository`, this.tableName, error);
        }

    }
}

module.exports = TransactionCommentRepository