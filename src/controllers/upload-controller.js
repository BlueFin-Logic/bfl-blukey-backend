const UploadHandler = require('../handlers/upload-handler')
const { HashService } = require('../common/hash')
const CustomResponse = require('../response_error/response')
const CustomError = require('../response_error/error')
const DocumentService = require('../services/document-service')

module.exports.upload = function upload(appContext) {
    return async (req, res, next) => {
        try {
            const currentUserId = req.currentUserId;

            let dataFile = Buffer.from(req.file.buffer);
            let originalNameFile = req.file.originalname;
            let mimeTypeFile = req.file.mimetype;

            let db = appContext.getDB;
            let service = new DocumentService(db);
            let handler = new UploadHandler(service);

            let storage = appContext.getStorage;
            let data = await handler.upload(storage, currentUserId, dataFile, originalNameFile, mimeTypeFile);
            next(CustomResponse.newSimpleResponse(`Upload Controller`, `Upload successful!`, data));
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.unauthorized(`Upload Controller`, `Upload had problems!.`, err));
        }
    }
}