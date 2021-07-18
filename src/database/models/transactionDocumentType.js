module.exports = (sequelize, DataTypes, Model) => {
    class TransactionDocumentType extends Model {
        accessUrl(storageAccount, blobSAS) {
            return `https://${storageAccount}.blob.core.windows.net/${this.container}/${this.folder}/${this.fileName}?${blobSAS}`;
        }
    }
    TransactionDocumentType.init({
        transactionId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Transaction',
                key: 'id'
            }
        },
        documentTypeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'DocumentType',
                key: 'id'
            }
        },
        container: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [1, 10]
            }
        },
        folder: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [1, 10]
            }
        },
        fileName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
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
    return TransactionDocumentType;
}