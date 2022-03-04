const BaseService = require('../services/base');
const MyError = require('../common/error');
const Hash = require('../helper/hash');
const Utilities = require('../helper/utilities');
const {Op} = require('sequelize');

class UserService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getAll(page, limit, query) {
        try {
            if (!this.currentUser.isAdmin) throw MyError.forbidden(`${this.tableName} Service`);
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
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getById(userId) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw MyError.forbidden(`${this.tableName} Service`);
            }
            const user = await this.repository.getById(userId);
            // Check user is exist.
            if (!user) throw MyError.badRequest(`${this.tableName} Service`, "User is not found!");
            return user;
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data, emailService, loggingDb) {
        try {
            if (!this.currentUser.isAdmin) throw MyError.forbidden(`${this.tableName} Service`);
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

            if (userExist) throw MyError.badRequest(`${this.tableName} Service`, "Email or username already exist!");

            // Create
            const result = await this.repository.addItem(data);
            // Loging DB Create
            loggingDb.addItem(this.currentUser.id, this.tableName, result);
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
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async update(userId, data, loggingDb) {
        try {
            if (!this.currentUser.isAdmin) { // User is not an admin
                if (this.currentUser.id !== userId) throw MyError.forbidden(`${this.tableName} Service`);
                delete data.isAdmin;
            }

            if (this.currentUser.id !== userId) { // Only user can change their own password
                delete data.oldPassword;
                delete data.password;
            }

            const atributes = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate', 'createdAt', 'updatedAt'];

            const userExist = await this.repository.getById(userId, atributes);
            if (!userExist) throw MyError.badRequest(`${this.tableName} Service`, "User is not found!");

            // Have first name - Miss last name
            if (data.firstName && !data.lastName) data.lastName = userExist.lastName;

            // Have last name - Miss first name
            if (data.lastName && !data.firstName) data.firstName = userExist.firstName;

            // Have last name - Have first name
            if (data.lastName && data.firstName) data.fullName = "";

            // Change password
            if (data.oldPassword && data.password) {
                if (data.oldPassword === data.password) throw MyError.badRequest(`${this.tableName} Service`, "Old Password is not the same as New Password!");
                if (!await Hash.compareHash(data.oldPassword, userExist.password)) throw MyError.badRequest(`${this.tableName} Service`, "Password is not correct!");
            } else delete data.password;

            // Update
            const result = await this.repository.updateItem(data, { id: userId });
            // Get data updated
            const updated = await this.repository.getById(userId, atributes);
            // Loging DB Update
            loggingDb.updateItem(this.currentUser.id, this.tableName, userExist, updated);

            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(userId, deactivate, loggingDb) {
        try {
            if (!this.currentUser.isAdmin) {
                throw MyError.forbidden(`${this.tableName} Service`);
            }

            const fields = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate', 'createdAt', 'updatedAt', 'deactivatedAt'];
            const userExist = await this.repository.getById(userId, fields);
            // Check user is exist.
            if (!userExist) throw MyError.badRequest(`${this.tableName} Service`, "User is not found!");

            // Want user deactivate and user already deactivated
            if (deactivate && userExist.deactivatedAt) throw MyError.badRequest(`${this.tableName} Service`, "User already deactivated!");

            // Want user activate and user already activated
            if (!deactivate && !userExist.deactivatedAt) throw MyError.badRequest(`${this.tableName} Service`, "User already activated!");

            const conditions = {
                id: userId
            };

            if (deactivate) {
                // Soft delete
                await this.repository.deleteItem(conditions);
                // Get data updated
                const updated = await this.repository.getById(userId, ['deactivatedAt']);
                // Loging DB Soft Delete
                loggingDb.deleteSoftItem(this.currentUser.id, this.tableName, userExist, { 'deactivatedAt': updated.deactivatedAt });
            }

            if (!deactivate) {
                // Restore
                await this.repository.restoreItem(conditions);
                // Loging DB Restore
                loggingDb.restoreItem(this.currentUser.id, this.tableName, userExist, { 'deactivatedAt': null });
            }

            return {
                id: userId
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = UserService