module.exports = (sequelize, DataTypes, Model) => {
    class LoggingDb extends Model {
    }
    LoggingDb.init({
        id: {
            autoIncrement: true,
            type: DataTypes.SMALLINT,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        table: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                len: [1, 50]
            }
        },
        action: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                isAlpha: true,
                len: [1, 20]
            }
        },
        dataBefore: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dataAfter: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            noUpdate: true
        },
    }, {
        sequelize,
        schema: 'dbo',
        timestamps: true,
        paranoid: false,
        updatedAt: false
    })
    return LoggingDb;
}