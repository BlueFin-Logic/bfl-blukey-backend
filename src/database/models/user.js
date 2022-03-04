const Hash = require('../../helper/hash');

module.exports = (sequelize, DataTypes, Model) => {
    class User extends Model {
    }
    User.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                len: [1, 20]
            },
            set(value) {
                this.setDataValue('firstName', value.replace(/\s+/g, ' ').trim());
            }
        },
        lastName: {
            type: DataTypes.STRING(80),
            allowNull: false,
            validate: {
                len: [1, 80]
            },
            set(value) {
                this.setDataValue('lastName', value.replace(/\s+/g, ' ').trim());
            }
        },
        fullName: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                len: [1, 120]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [1, 100]
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
        userName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [1, 30]
            },
            set(value) {
                this.setDataValue('userName', value.toLowerCase());
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            },
            set(value) {
                // this.setDataValue('password', Hash.hashPassword(this.userName, value))
                this.setDataValue('password', Hash.hashPassword(value))
            }
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lastLoginDate: {
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
        hooks: {
            beforeValidate: (user, options) => {
                user.fullName = `${user.firstName} ${user.lastName}`;
            }
        },
        sequelize,
        schema: 'dbo',
        timestamps: true,
        paranoid: true,
        deletedAt: 'deactivatedAt'
    })
    return User;
}