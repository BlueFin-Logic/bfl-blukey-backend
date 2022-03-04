const MyError = require('../common/error');
const Hash = require('../helper/hash');
const Time = require('../helper/time');
const Utilities = require('../helper/utilities');

class AuthenService {
    constructor(repository) {
        this.repository = repository;
        this.tableName = this.repository.tableName;
    }

    async login(item, tokenService, sessionService) {
        try {
            const {
                userName: itemUserName,
                password: itemPassword
            } = item;

            const fields = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate'];
            const userExist = await this.repository.getOne({ userName: itemUserName.toLowerCase() }, fields);

            // Check user is exist.
            if (!userExist) throw MyError.badRequest(`Authentication Service`, "User is not found!");

            const [checkPassword, userSession] = await Promise.all([
                Hash.compareHash(itemPassword, userExist.password), // Compare password with userExist.
                sessionService.getOne(userExist.id) // Check user have session
            ]);

            // Check user correct pass.
            if (!checkPassword) throw MyError.badRequest(`Authentication Service`, "Invalid password!");

            // Data for body tokenJWT
            const data = {
                id: userExist.id,
                isAdmin: userExist.isAdmin
            }

            // Create token
            const accessToken = tokenService.sign(data, userExist.email);
            const refreshToken = tokenService.sign(data, userExist.email, "30 days");

            // User data for logged in
            const { password, lastLoginDate, ...restDataUser } = userExist.toJSON();

            // Body update last login date
            const dataUserLastLogInDate = {
                lastLoginDate: Time.getLatestTimeUTC()
            }

            // Update ACCESS TOKEN for session and Update User
            if (userSession) { // if user is already in session or used to login system, update
                await Promise.all([
                    sessionService.updateItem(userSession.userId, accessToken),
                    this.repository.updateItem(dataUserLastLogInDate, { id: userExist.id })
                ]);
            } else {
                await Promise.all([
                    sessionService.addItem(userExist.id, accessToken),
                    this.repository.updateItem(dataUserLastLogInDate, { id: userExist.id })
                ]);
            }

            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    lastLoginDate: dataUserLastLogInDate.lastLoginDate,
                    ...restDataUser
                }
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.unauthorized(`Authentication Service`, `Unauthorized.`, err);
        }
    }

    async authorized(token, tokenService, sessionService) {
        try {
            // Verify the token
            const decoded = tokenService.verify(token);
            const { id: userId } = decoded;

            // Check user have session
            const userExistSession = await sessionService.getOne(userId, token);

            // Check token out of session
            if (!userExistSession) throw MyError.badRequest(`Authentication Service`, "Token out of session!");

            const userExist = await this.repository.getById(userId, ['id', 'isAdmin'], null, true);
            // Check user is not exist.
            if (!userExist) throw MyError.badRequest(`Authentication Service`, "User is not found!");
            return userExist;
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotGetEntity(`Authentication Service`, this.tableName, err);
        }
    }

    async logout(currentUserId, sessionService) {
        try {
            if (!currentUserId) throw MyError.badRequest(`Authentication Service`, "ID from token is not found!");

            // Check user have session
            const userExistSession = await sessionService.getOne(currentUserId);

            // User has already logged out.
            if (!userExistSession) throw MyError.badRequest(`Authentication Service`, "User has already logged out!");

            // User still logged in.
            // await sessionService.deleteItem(currentUserId);
            await sessionService.updateItem(currentUserId, "");

            return {
                id: currentUserId
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotDeleteEntity(`Authentication Service`, this.tableName, err);
        }
    }

    async resetPassword(body, emailService, loggingDb) {
        try {
            const { userName } = body;
            // Email is mandatory
            if (!userName) throw MyError.badRequest(`Authentication Service`, "Username is mandatory!");

            // Check email in database
            const condition = {
                userName: userName
            };
            const atributes = ['id', 'firstName', 'lastName', 'fullName', 'email', 'address', 'userName', 'password', 'isAdmin', 'lastLoginDate', 'createdAt', 'updatedAt'];
            const userExist = await this.repository.getOne(condition, atributes);

            // User is not exist
            if (!userExist) throw MyError.badRequest(`Authentication Service`, "User is not exist!");

            // Generate new password for user account
            const newPassword = Utilities.randomString(8);

            // Send email
            const successSend = await emailService.sendMail(
                userExist.email,
                emailService.resetPasswordSubject(),
                emailService.resetPasswordContent(userExist, newPassword)
            );

            // Cannot send email
            if (!successSend) throw MyError.badRequest(`Authentication Service`, "Send email for user forgot password not successful. So you can use the old password to login again if you remember!");

            // Update new password for the user
            const dataUpdate = {
                password: newPassword
            }
            await this.repository.updateItem(dataUpdate, { id: userExist.id });
            // Get data updated
            const updated = await this.repository.getById(userExist.id, atributes);
            // Loging DB Update
            loggingDb.updateItem(userExist.id, this.tableName, userExist, updated);

            return {
                id: userExist.id
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotUpdateEntity(`Authentication Service`, this.tableName, err);
        }
    }
}

module.exports = AuthenService