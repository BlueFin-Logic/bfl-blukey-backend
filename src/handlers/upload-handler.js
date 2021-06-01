const BaseHandler = require('./base-handler');
const CustomError = require('../response_error/error');
const DocumentModel = require('../model/document');
const TABLE_USER = DocumentModel.tableName

class UploadHandler extends BaseHandler {
    constructor(service) {
        super(service, TABLE_USER);
    }

    async upload(storage, currentUserId, dataFile, originalNameFile, mimeTypeFile) {
        try {
            let containerName = "pdf";
            await storage.createContainersIfNotExists(containerName);

            // TODO: Need to add number at the end name and format extension name file.
            let fileName = `${currentUserId}_${originalNameFile}`;
            await storage.uploadDataToBlob(containerName, dataFile, fileName, mimeTypeFile);

            let item = {
                "container": containerName,
                "file_name": fileName,
                "user_id": currentUserId
            };

            let document = await this.service.addItem(item);

            let blobSAS = storage.generateBlobSAS(containerName);

            return {
                file_name: fileName,
                url: `https://${storage.account}.blob.core.windows.net/${containerName}/${fileName}?${blobSAS}`
            };
        } catch (err) {
            if (err instanceof CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.table} Handler`, this.table, err);
        }
    }
}

module.exports = UploadHandler;