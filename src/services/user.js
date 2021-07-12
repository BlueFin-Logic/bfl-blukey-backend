const BaseService = require('../services/base');
const CustomError = require('../common/error');
const hash = require('../helper/hash');
const {Op} = require('sequelize');

class UserService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async getAll(page, limit) {
        try {
            // const {total, users} = await this.repository.getAll(page, limit);
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

    async getById(id) {
        try {
            let user = await this.repository.getById(id);
            // Check user is exist.
            if (!user) throw CustomError.badRequest(`${this.table} Handler`, "User is not found!");
            return user;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data) {
        try {
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

            let createdUser = await this.repository.addItem(data)
            return createdUser;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async update(id, data) {
        try {
            let userExist = await this.repository.getById(id, ['userName', 'password']);
            if (!userExist) throw CustomError.badRequest(`${this.tableName} Handler`, "User is not found!");

            // Change password
            if (data.oldPassword) {
                if (!data.password || userExist.password !== hash.hashPassword(userExist.userName, data.oldPassword)) {
                    throw CustomError.badRequest(`${this.tableName} Handler`, "Password is not correct!");
                }
            } else {
                data.password = null;
            }

            // Update user
            let updatedUser = await this.repository.updateItem(userExist.userName, data, {id: id});
            return updatedUser;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = UserService