const DocumentUserRepository = require('../repositories/documentUser')
const DocumentUserService = require('../services/documentUser')
// const TransactionDocumentTypeRepository = require('../repositories/documentUser')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const tableName = "Upload";

module.exports.uploadDocumentUser = (appContext) => {
    return async (req, res, next) => {
        try {
            const currentUserId = req.currentUserId;

            let dataFile = Buffer.from(req.file.buffer);
            let originalNameFile = req.file.originalname;
            let mimeTypeFile = req.file.mimetype;

            let storage = appContext.getStorage;

            let models = appContext.getDB;
            let repository = new DocumentUserRepository(models);
            let service = new DocumentUserService(repository, storage);

            let data = await service.upload(currentUserId, dataFile, originalNameFile, mimeTypeFile);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Upload successful!`, data));
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.unauthorized(`${tableName} Controller`, `Upload had problems!.`, err));
        }
    }
}