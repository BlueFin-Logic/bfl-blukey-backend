const BaseService = require('../services/base');
const MyError = require('../common/error');
const Time = require('../helper/time');
const CONFIG = require('../config');
const Utilities = require('../helper/utilities');

class DocumentUserService extends BaseService {
    constructor(repository, currentUser, storage) {
        super(repository, currentUser);
        this.storage = storage;
        this.containerName = CONFIG.azureStorage.containerUser;
    }

    async upload(dataFile, originalNameFile, mimeTypeFile, loggingDb) {
        try {
            const currentUserId = this.currentUser.id;
            const folder = `user_${currentUserId}`;
            await this.storage.createContainersIfNotExists(this.containerName);
            
            const fileName = `${currentUserId}_${Time.getCurrentUnixTimestamp()}_${originalNameFile}`;
            await this.storage.uploadDataOnBlob(this.containerName, dataFile, fileName, folder, mimeTypeFile);

            const documentUser = {
                container: this.containerName,
                folder: folder,
                fileName: fileName,
                userId: currentUserId
            };

            // Create
            const document = await this.repository.addItem(documentUser);
            // Loging DB Create
            loggingDb.addItem(this.currentUser.id, this.tableName, document);

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 2);

            return {
                id: document.id,
                url: document.accessUrl(this.storage.account, blobSAS),
                fileName: fileName
            };
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(id, loggingDb) {
        try {
            const fields = ['id', 'container', 'folder', 'fileName', 'userId', 'createdAt', 'updatedAt'];
            const documentExist = await this.repository.getById(id, fields);

            if (!documentExist) throw MyError.badRequest(`${this.tableName} Service`, "Document User is not found!");

            if (!this.currentUser.isAdmin && this.currentUser.id !== documentExist.userId) throw MyError.forbidden(`${this.tableName} Service`);

            // Delete
            await this.repository.deleteItem({ id: documentExist.id });
            // Loging DB Delete
            loggingDb.deleteHardItem(this.currentUser.id, this.tableName, documentExist);

            await this.storage.deleteDataOnBlob(this.containerName, `${documentExist.folder}/${documentExist.fileName}`);

            return {
                id: id
            };
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getDocumentInfoByUserId(userId) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw MyError.forbidden(`${this.tableName} Service`);
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
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = DocumentUserService