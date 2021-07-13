module.exports = (sequelize, DataTypes, Model) => {
    class Transaction extends Model {
    }
    Transaction.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
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
        address: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        city: {
            type: DataTypes.STRING(15),
            allowNull: false,
            isAlpha: true,
            validate: {
                len: [1, 15]
            }
        },
        state: {
            type: DataTypes.STRING(2),
            allowNull: false,
            isAlpha: true,
            validate: {
                len: [1, 2]
            }
        },
        zipCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            isAlphanumeric: true,
            validate: {
                len: [1, 10]
            }
        },
        mlsId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            isAlphanumeric: true,
            validate: {
                len: [1, 20]
            }
        },
        apn: {
            type: DataTypes.STRING(50),
            allowNull: false,
            isAlphanumeric: true,
            validate: {
                len: [1, 50]
            }
        },
        listingPrice: {
            type: DataTypes.DECIMAL(20,10),
            allowNull: false,
            isAlphanumeric: true,
            min: 0
        },
        commissionAmount: {
            type: DataTypes.DECIMAL(20,10),
            allowNull: false,
            isAlphanumeric: true,
            min: 0
        },
        buyerName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        sellerName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        canComplete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        transactionStatusId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            // references: {
            //     model: 'TransactionStatus',
            //     key: 'id'
            // }
        },
        listingStartDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        listingEndDate: {
            type: DataTypes.DATE,
            allowNull: false
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
    return Transaction;
}