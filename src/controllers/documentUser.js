const Repository = require('../repositories/documentUser')
const Service = require('../services/documentUser')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "DocumentUser";

module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            const userId = Utilities.parseInt(req.query.userId, 0);

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository, currentUser, storage);

            const data = await service.getDocumentInfoByUserId(userId);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}