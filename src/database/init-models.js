module.exports = (sequelize, DataTypes, Model) => {
    const User = require("./models/user")(sequelize, DataTypes, Model);
    const DocumentUser = require("./models/documentUser")(sequelize, DataTypes, Model);
    const Transaction = require("./models/transaction")(sequelize, DataTypes, Model);
    const TransactionDocumentType = require("./models/transactionDocumentType")(sequelize, DataTypes, Model);
    const DocumentType = require("./models/documentType")(sequelize, DataTypes, Model);
    const TransactionStatus = require("./models/transactionStatus")(sequelize, DataTypes, Model);
    const TransactionComment = require("./models/transactionComment")(sequelize, DataTypes, Model);

    // Relationship [User] 1-n [DocumentUser]
    User.hasMany(DocumentUser, {
        as: "DocumentUsers",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    DocumentUser.belongsTo(User, {
        as: "User",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [User] 1-n [Transaction]
    User.hasMany(Transaction, {
        as: "Transactions",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Transaction.belongsTo(User, {
        as: "User",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [User] 1-n [TransactionComment]
    User.hasMany(TransactionComment, {
        as: "TransactionComments",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    TransactionComment.belongsTo(User, {
        as: "User",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [Transaction] n-n [DocumentType] -> [TransactionDocumentType]
    Transaction.belongsToMany(DocumentType, {
        as: 'documentTypeId_DocumentTypes',
        through: {
            model: TransactionDocumentType,
            unique: false,
            paranoid: true
        },
        foreignKey: 'transactionId',
        otherKey: 'documentTypeId',
        timestamps: true,
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    DocumentType.belongsToMany(Transaction, {
        as: 'transactionId_Transactions',
        through: {
            model: TransactionDocumentType,
            unique: false,
            paranoid: true
        },
        foreignKey: 'documentTypeId',
        otherKey: 'transactionId',
        timestamps: true,
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [TransactionStatus] 1-n [Transaction]
    TransactionStatus.hasMany(Transaction, {
        as: "Transactions",
        foreignKey: "transactionStatusId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Transaction.belongsTo(TransactionStatus, {
        as: "TransactionStatus",
        foreignKey: "transactionStatusId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [Transaction] 1-n [TransactionComment]
    Transaction.hasMany(TransactionComment, {
        as: "TransactionComments",
        foreignKey: "transactionId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    TransactionComment.belongsTo(Transaction, {
        as: "Transaction",
        foreignKey: "transactionId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    return {
        User,
        DocumentUser,
        Transaction,
        TransactionDocumentType,
        DocumentType,
        TransactionStatus,
        TransactionComment
    }
}
