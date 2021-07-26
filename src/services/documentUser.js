const BaseService = require('../services/base');
const CustomError = require('../common/error');
const Time = require('../helper/time');

class DocumentUserService extends BaseService {
    constructor(repository, currentUser, storage) {
        super(repository, currentUser);
        this.storage = storage;
        this.containerName = "userinfo";
    }

    async upload(dataFile, originalNameFile, mimeTypeFile) {
        try {
            const currentUserId = this.currentUser.id;
            const folder = `user_${currentUserId}`;
            await this.storage.createContainersIfNotExists(this.containerName);

            // TODO: Format extension name file.
            const fileName = `${currentUserId}_${Time.getCurrentUnixTimestamp()}_${originalNameFile}`;
            await this.storage.uploadDataOnBlob(this.containerName, dataFile, fileName, folder, mimeTypeFile);

            let documentUser = {
                container: this.containerName,
                folder: folder,
                fileName: fileName,
                userId: currentUserId
            };

            let document = await this.repository.addItem(documentUser);

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 2);

            return {
                url: document.accessUrl(this.storage.account, blobSAS),
                fileName: fileName
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async getDocumentInfoByUserId(userId) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw CustomError.forbidden(`${this.tableName} Handler`);
            }
            // Get documents belong to user just have inserted.
            let documents = await this.repository.getByCondition({userId: userId});
            if (documents.length === 0) return documents;

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 60);
            // documentsURL
            return documents.map(document => {
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