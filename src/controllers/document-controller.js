const DocumentHandler = require('../handlers/document-handler')
const { Utilities } = require('../common/utilities')
const CustomResponse = require('../response_error/response')
const CustomError = require('../response_error/error')
const DocumentService = require('../services/document-service')

module.exports.getByUserID = function getByUserID(appContext) {
    return async (req, res, next) => {
        try {
            let userID = Utilities.parseInt(req.query.userID, 1);

            let db = appContext.getDB;
            let service = new DocumentService(db);
            let handler = new DocumentHandler(service);
            
            let storage = appContext.getStorage;
            let data = await handler.getByUserId(storage, userID);
            next(CustomResponse.newSimpleResponse(`Upload Controller`, `Upload successful!`, data));
            // next(CustomResponse.newSimpleResponse(`Upload Controller`, `Upload successful!`, ""));
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.unauthorized(`Upload Controller`, `Upload had problems!.`, err));
        }
    }
}