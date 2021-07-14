const BaseService = require('../services/base');
const CustomError = require('../common/error');
const time = require('../helper/time');

class DocumentUserService extends BaseService {
    constructor(service, storage) {
        super(service);
        this.storage = storage;
        this.containerName = "userinfo";
    }

    async upload(currentUserId, dataFile, originalNameFile, mimeTypeFile) {
        try {
            const folder = currentUserId;
            await this.storage.createContainersIfNotExists(this.containerName);

            // TODO: Format extension name file.
            const fileName = `${currentUserId}_${time.getCurrentUnixTimestamp()}_${originalNameFile}`;
            await this.storage.uploadDataOnBlob(this.containerName, dataFile, fileName, folder, mimeTypeFile);

            let documentUser = {
                container: this.containerName,
                folder: folder,
                fileName: fileName,
                userId: currentUserId
            };

            let document = await this.repository.addItem(documentUser);

            let blobSAS = this.storage.generateBlobSAS(this.containerName, 2);

            return {
                url: document.accessUrl(this.storage.account, blobSAS),
                fileName: fileName
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.table, err);
        }
    }

    async getDocumentInfoByUserId(id) {
        try {
            // Get documents belong to user just have inserted.
            let documents = await this.repository.getByCondition({userId: id});
            if (documents.length === 0) throw CustomError.badRequest(`${this.tableName} Handler`, "Documents belong to user is not found!");

            // documentsURL
            return documents.map(document => {
                let blobSAS = this.storage.generateBlobSAS(document.container, 60);
                return {
                    url: document.accessUrl(this.storage.account, blobSAS),
                    ...document.toJSON()
                }
            });
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = DocumentUserService