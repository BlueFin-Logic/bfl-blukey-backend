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
        as: "documentUsers",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    DocumentUser.belongsTo(User, {
        as: "user",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [User] 1-n [Transaction]
    User.hasMany(Transaction, {
        as: "transactions",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Transaction.belongsTo(User, {
        as: "user",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [User] 1-n [TransactionComment]
    User.hasMany(TransactionComment, {
        as: "transactionComments",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    TransactionComment.belongsTo(User, {
        as: "user",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [Transaction] n-n [DocumentType] -> [TransactionDocumentType]
    Transaction.belongsToMany(DocumentType, {
        as: 'documentTypes',
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
        as: 'transactions',
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
    
    // Relationship [Transaction] 1-n [TransactionDocumentType]
    Transaction.hasMany(TransactionDocumentType, {
        as: "transactionDocumentTypes",
        foreignKey: "transactionId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    TransactionDocumentType.belongsTo(Transaction, {
        as: "transaction",
        foreignKey: "transactionId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [DocumentType] 1-n [TransactionDocumentType]
    DocumentType.hasMany(TransactionDocumentType, {
        as: "transactionDocumentTypes",
        foreignKey: "documentTypeId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    TransactionDocumentType.belongsTo(DocumentType, {
        as: "documentType",
        foreignKey: "documentTypeId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [TransactionStatus] 1-n [Transaction]
    TransactionStatus.hasMany(Transaction, {
        as: "transactions",
        foreignKey: "transactionStatusId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Transaction.belongsTo(TransactionStatus, {
        as: "transactionStatus",
        foreignKey: "transactionStatusId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    // Relationship [Transaction] 1-n [TransactionComment]
    Transaction.hasMany(TransactionComment, {
        as: "transactionComments",
        foreignKey: "transactionId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    TransactionComment.belongsTo(Transaction, {
        as: "transaction",
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
