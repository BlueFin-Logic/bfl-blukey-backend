const DocumentUserRepository = require('../repositories/documentUser')
const DocumentUserService = require('../services/documentUser')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "DocumentUser";

module.exports.getByCondition = (appContext) => {
    return async (req, res, next) => {
        try {
            // If admin keep query. But not replace userId is currentUserId
            let userId = req.currentUserId;
            if (req.currentUserIsAdmin) userId = Utilities.parseInt(req.query.userId, 1);

            let storage = appContext.getStorage;

            let models = appContext.getDB;
            let repository = new DocumentUserRepository(models);
            let service = new DocumentUserService(repository, storage);

            let data = await service.getDocumentInfoByUserId(userId);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Get list ${tableName} successful.`, data))
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.cannotListEntity(`${tableName} Controller`, `${tableName}`, err));
        }
    }
}