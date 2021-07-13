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
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [1, 10]
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