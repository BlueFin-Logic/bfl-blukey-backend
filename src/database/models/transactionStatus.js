module.exports = (sequelize, DataTypes, Model) => {
    class TransactionStatus extends Model {
    }
    TransactionStatus.init({
        id: {
            autoIncrement: true,
            type: DataTypes.SMALLINT,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            noUpdate: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }, {
        sequelize,
        schema: 'dbo',
        timestamps: true,
        paranoid: true
    })
    return TransactionStatus;
}