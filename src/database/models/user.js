const hash = require('../../helper/hash');

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
            }
        },
        lastName: {
            type: DataTypes.STRING(80),
            allowNull: false,
            validate: {
                len: [1, 80]
            }
        },
        fullName: {
            // type: DataTypes.VIRTUAL,
            // get() {
            //     return `${this.firstName} ${this.lastName}`;
            // }
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                len: [1, 120]
            }
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            isEmail: true,
            validate: {
                len: [1, 30]
            }
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        userName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            isAlphanumeric: true,
            validate: {
                len: [1, 30]
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            },
            set(value) {
                this.setDataValue('password', hash.hashPassword(this.userName, value))
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