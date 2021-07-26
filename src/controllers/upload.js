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
            let dataFile = Buffer.from(req.file.buffer);
            let originalNameFile = req.file.originalname;
            let mimeTypeFile = req.file.mimetype;

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new DocumentUserRepository(models);
            const service = new DocumentUserService(repository, currentUser, storage);

            const data = await service.upload(dataFile, originalNameFile, mimeTypeFile);
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
            const transdocsId = {
                transactionId: Utilities.parseInt(req.query.transactionId, 0),
                documentTypeId: Utilities.parseInt(req.query.documentTypeId, 0)
            }

            let dataFile = Buffer.from(req.file.buffer);
            let originalNameFile = req.file.originalname;
            let mimeTypeFile = req.file.mimetype;

            const currentUser = req.currentUser;
            const storage = appContext.getStorage;
            const models = appContext.getDB;
            const repository = new TransactionDocumentTypeRepository(models);
            const service = new TransactionDocumentTypeService(repository, currentUser, storage);

            const data = await service.upload(transdocsId, dataFile, originalNameFile, mimeTypeFile);
            next(CustomResponse.newSimpleResponse(`${tableName} Controller`, `Upload successful!`, data));
        } catch (err) {
            if (err instanceof CustomError.CustomError) next(err);
            else next(CustomError.badRequest(`${tableName} Controller`, `Upload had problems!.`, err));
        }
    }
}