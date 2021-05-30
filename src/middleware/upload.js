const FormDataService = require('../common/form-data')
const FileTypeService = require('../common/file-type')
const CustomError = require('../response_error/error')

// Validate Upload user
module.exports.validateUploadMiddleware = function validateUploadMiddleware(appContext) {
    return async (req, res, next) => {
        try {
            await FormDataService.config(req, res);
            if (req.file.mimetype !== "application/pdf") throw CustomError.badRequest(`Upload Middleware`, `Attachment upload is not PDF!`);
            let mine = await FileTypeService.fromBuffer(req.file.buffer);
            if (mine.mime !== "application/pdf") throw CustomError.badRequest(`Upload Middleware`, `Attachment upload is not real PDF!`);
            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            else next(CustomError.badRequest(`Upload Middleware`, `Attachment upload is not success!.`, err));
        }
    }
}