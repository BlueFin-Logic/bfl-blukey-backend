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
            },
            set(value) {
                this.setDataValue('address', value.replace(/\s+/g, ' ').trim());
            }
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                not: /[^a-zA-Z ]/,
                len: [1, 100]
            },
            set(value) {
                this.setDataValue('city', value.replace(/\s+/g, ' ').trim());
            }
        },
        state: {
            type: DataTypes.STRING(2),
            allowNull: false,
            validate: {
                isAlpha: true,
                len: [1, 2]
            },
            set(value) {
                this.setDataValue('state', value.toUpperCase());
            }
        },
        zipCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [1, 10]
            }
        },
        mlsId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                // isAlphanumeric: true,
                len: [1, 20]
            }
        },
        apn: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                // is: /\d{3}-\d{3}-\d{3}$/,
                len: [1, 50]
            }
        },
        listingPrice: {
            type: DataTypes.DECIMAL(20,4),
            allowNull: false,
            validate: {
                isNumeric: true,
                min: 0
            }
        },
        commissionAmount: {
            type: DataTypes.DECIMAL(20,4),
            allowNull: false,
            validate: {
                isNumeric: true,
                min: 0
            }
        },
        buyerName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            },
            set(value) {
                this.setDataValue('buyerName', value.replace(/\s+/g, ' ').trim());
            }
        },
        sellerName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            },
            set(value) {
                this.setDataValue('sellerName', value.replace(/\s+/g, ' ').trim());
            }
        },
        transactionStatusId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
            // references: {
            //     model: 'TransactionStatus',
            //     key: 'id'
            // }
        },
        isListing: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        listingStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        listingEndDate: {
            type: DataTypes.DATEONLY,
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