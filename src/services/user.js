const BaseService = require('../services/base');
const CustomError = require('../common/error');
const hash = require('../helper/hash');
const {Op} = require('sequelize');

class UserService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getAll(page, limit) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${tableName} Handler`);
            const {count, rows} = await this.repository.getAll(page, limit);
            return {
                total: count,
                data: rows
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getById(userId) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw CustomError.forbidden(`${this.tableName} Handler`);
            }
            let user = await this.repository.getById(userId);
            // Check user is exist.
            if (!user) throw CustomError.badRequest(`${this.tableName} Handler`, "User is not found!");
            return user;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Handler`);
            let where = {
                [Op.or]: [
                    {
                        email: {
                            [Op.eq]: data.email
                        }
                    },
                    {
                        userName: {
                            [Op.eq]: data.userName
                        }
                    }
                ]
            }

            let userExist = await this.repository.getOne(where, ['id']);

            if (userExist) throw CustomError.badRequest(`${this.tableName} Handler`, "Email or username already exist!");

            let result = await this.repository.addItem(data);
            return {
                id: result.id
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async update(userId, data) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw CustomError.forbidden(`${this.tableName} Handler`);
                delete data.isAdmin;
            }

            let userExist = await this.repository.getById(userId, ['userName', 'password']);
            if (!userExist) throw CustomError.badRequest(`${this.tableName} Handler`, "User is not found!");

            // Change password
            if (data.oldPassword) {
                if (!data.password || userExist.password !== hash.hashPassword(userExist.userName, data.oldPassword)) {
                    throw CustomError.badRequest(`${this.tableName} Handler`, "Password is not correct!");
                }
            } else {
                delete data.password;
            }

            // Update user
            let result = await this.repository.updateItem(userExist.userName, data, {id: userId});
            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = UserService