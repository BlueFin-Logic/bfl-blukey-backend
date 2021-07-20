const DocumentUserRepository = require('../repositories/documentUser')
const DocumentUserService = require('../services/documentUser')
const TransactionDocumentTypeRepository = require('../repositories/transactionDocumentType')
const TransactionDocumentTypeService = require('../services/transactionDocumentType')
const CustomResponse = require('../common/response')
const CustomError = require('../common/error')
const Utilities = require('../helper/utilities')
const tableName = "Upload";

// Upload DocumentUser
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
            else next(CustomError.badRequest(`${tableName} Controller`, `Upload had problems!.`, err));
        }
    }
}

// Upload Transaction DocumentType
module.exports.uploadTransactionDocumentType = (appContext) => {
    return async (req, res, next) => {
        try {
            const id = {
                transactionId: Utilities.parseInt(req.query.transactionId, 1),
                documentTypeId: Utilities.parseInt(req.query.documentTypeId, 1)
            }

            let dataFile = Buffer.from(req.file.buffer);
            let originalNameFile = req.file.originalname;
            let mimeTypeFile = req.file.mimetype;

            let storage = appContext.getStorage;

            let models = appContext.getDB;
            let repository = new TransactionDocumentTypeRepository(models);
            let service = new TransactionDocumentTypeService(repository, storage);

            let data = await service.upload(id, dataFile, originalNameFile, mimeTypeFile);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Upload successful!`, data));
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.badRequest(`${tableName} Controller`, `Upload had problems!.`, err));
        }
    }
}