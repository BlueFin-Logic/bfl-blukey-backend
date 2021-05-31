const BaseHandler = require('./base-handler');
const CustomError = require('../response_error/error');
const DocumentModel = require('../model/document');
const TABLE_USER = DocumentModel.tableName

class DocumentHandler extends BaseHandler {
    constructor(service) {
        super(service, TABLE_USER);
    }

    async getByUserId(storage, data) {
        try {
            // Get document just have inserted.
            let fields = `${DocumentModel.id},
                            ${DocumentModel.container},
                            ${DocumentModel.file_name}`;
            let condition = `${DocumentModel.user_id} = @id AND ${DocumentModel.is_deleted} = 0`;
            let documents = await this.service.getByCondition(fields, condition, {id: data});

            if (documents.length === 0) throw CustomError.badRequest(`${this.table} Handler`, "Document is not found!");

            let documentsURL = documents.map(document => {
                let blobSAS = storage.generateBlobSAS(document.container);
                return {
                    ...document,
                    url: `https://${storage.account}.blob.core.windows.net/${document.container}/${document.file_name}?${blobSAS}`
                }
            });

            return documentsURL;
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.table} Handler`, this.table, err);
        }
    }
}

module.exports = DocumentHandler;