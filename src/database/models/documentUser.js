module.exports = (sequelize, DataTypes, Model) => {
    class DocumentUser extends Model {
        accessUrl(storageAccount, blobSAS) {
            return `https://${storageAccount}.blob.core.windows.net/${this.container}/${this.folder}/${this.fileName}?${blobSAS}`;
        }
    }
    DocumentUser.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        container: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [1, 10]
            }
        },
        folder: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                len: [1, 15]
            }
        },
        fileName: {
            type: DataTypes.STRING(225),
            allowNull: false,
            validate: {
                len: [1, 225]
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
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
    return DocumentUser;
}