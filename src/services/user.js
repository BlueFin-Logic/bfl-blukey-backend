const BaseService = require('../services/base');
const CustomError = require('../common/error');
const Hash = require('../helper/hash');
const Utilities = require('../helper/utilities');
const {Op} = require('sequelize');

class UserService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getAll(page, limit, query) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const conditions = query.fullName ? {
                fullName: {
                    [Op.substring]: `${query.fullName}`
                }
            } : null;
            if (query.fields) query.fields = Utilities.removeAllSpaceString(query.fields).split(',');
            const {count, rows} = await this.repository.getAll(page, limit, query.fields, conditions);
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
                if (this.currentUser.id !== userId) throw CustomError.forbidden(`${this.tableName} Service`);
            }
            const user = await this.repository.getById(userId);
            // Check user is exist.
            if (!user) throw CustomError.badRequest(`${this.tableName} Service`, "User is not found!");
            return user;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data, emailService, loggingDb, sequelize) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const where = {
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

            const userExist = await this.repository.getOne(where, ['id']);

            if (userExist) throw CustomError.badRequest(`${this.tableName} Service`, "Email or username already exist!");

            const result = await sequelize.transaction(async (trans) => {
                const created = await this.repository.addItem(data, trans);
                await loggingDb.addItem(this.currentUser.id, this.tableName, created, trans);
                return created;
            });

            // Send email
            emailService.sendMail(
                result.email, 
                emailService.newUserSubject(),
                emailService.newUserContent(result, data.password)
            );

            return {
                id: result.id
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async update(userId, data, loggingDb, sequelize) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw CustomError.forbidden(`${this.tableName} Service`);
                delete data.isAdmin;
            }

            const atributes = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate', 'createdAt', 'updatedAt'];

            // const userExist = await this.repository.getById(userId, ['firstName', 'lastName', 'password']);
            const userExist = await this.repository.getById(userId, atributes);
            if (!userExist) throw CustomError.badRequest(`${this.tableName} Service`, "User is not found!");

            // Have first name - Miss last name
            if (data.firstName && !data.lastName) data.lastName = userExist.lastName;

            // Have last name - Miss first name
            if (data.lastName && !data.firstName) data.firstName = userExist.firstName;

            // Have last name - Have first name
            if (data.lastName && data.firstName) data.fullName = "";

            // Change password
            if (data.oldPassword && data.password) {
                if (data.oldPassword === data.password) throw CustomError.badRequest(`${this.tableName} Service`, "Old Password is not the same as New Password!");
                if (!await Hash.compareHash(data.oldPassword, userExist.password)) throw CustomError.badRequest(`${this.tableName} Service`, "Password is not correct!");
            } else delete data.password;

            // Update user
            const result = await sequelize.transaction(async (trans) => {
                const updated = await this.repository.updateItem(data, { id: userId });
                const user = await this.repository.getById(userId, atributes);
                await loggingDb.updateItem(this.currentUser.id, this.tableName, userExist, user, trans);
                return updated;
            });

            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(userId) {
        try {
            if (!this.currentUser.isAdmin) {
                throw CustomError.forbidden(`${this.tableName} Service`);
            }

            const user = await this.repository.getById(userId);
            // Check user is exist.
            if (!user) throw CustomError.badRequest(`${this.tableName} Service`, "User is not found!");

            const conditions = {
                id: userId
            };
            await this.repository.deleteItem(conditions);
            return {
                id: userId
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = UserService