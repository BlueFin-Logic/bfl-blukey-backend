module.exports = (sequelize, DataTypes, Model) => {
    const User = require("./models/user")(sequelize, DataTypes, Model);
    const DocumentUser = require("./models/documentUser")(sequelize, DataTypes, Model);

    // Relationship [User] and [DocumentUser]
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

    return {
        User,
        DocumentUser
    }
}
