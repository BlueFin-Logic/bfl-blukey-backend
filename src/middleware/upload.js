const FormDataService = require('../helper/form-data')
const FileTypeService = require('../helper/file-type')
const Utilities = require('../helper/utilities')
const MyError = require('../common/error')

// Validate Upload File
module.exports.validateUpload = (appContext) => {
    return async (req, res, next) => {
        try {
            await FormDataService.config(req, res);
            if (req.file.mimetype !== "application/pdf") throw MyError.badRequest(`Upload Middleware`, `Attachment upload is not PDF!`);
            let mine = await FileTypeService.fromBuffer(req.file.buffer);
            if (mine.mime !== "application/pdf") throw MyError.badRequest(`Upload Middleware`, `Attachment upload is not real PDF!`);
            req.file.originalname = Utilities.keepCharactersEnglish(req.file.originalname);
            next();
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.badRequest(`Upload Middleware`, `Attachment upload is not success!.`, err));
        }
    }
}