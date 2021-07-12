const BaseService = require('../services/base');
const CustomError = require('../common/error');

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

            // TODO: Need to add number at the end name and format extension name file.
            const fileName = `${currentUserId}_${originalNameFile}`;
            await this.storage.uploadDataOnBlob(this.containerName, dataFile, fileName, folder, mimeTypeFile);

            let documentUser = {
                container: this.containerName,
                folder: folder,
                fileName: fileName,
                userId: currentUserId
            };

            await this.repository.addItem(documentUser);

            let blobSAS = this.storage.generateBlobSAS(this.containerName, 2);

            return {
                file_name: fileName,
                url: `https://${this.storage.account}.blob.core.windows.net/${this.containerName}/${documentUser.folder}/${documentUser.fileName}?${blobSAS}`
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.table, err);
        }
    }

    async getDocumentInfoByUserId(id) {
        try {
            // Get documents belong to user just have inserted.
            let documents = await this.repository.getByCondition({ userId: id });
            if (documents.length === 0) throw CustomError.badRequest(`${this.tableName} Handler`, "Documents belong to user is not found!");

            // documentsURL
            return documents.map(document => {
                let blobSAS = this.storage.generateBlobSAS(document.container, 60);
                document = document.toJSON();
                return {
                    ...document,
                    url: `https://${this.storage.account}.blob.core.windows.net/${this.containerName}/${document.folder}/${document.fileName}?${blobSAS}`
                }
            });
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = DocumentUserService