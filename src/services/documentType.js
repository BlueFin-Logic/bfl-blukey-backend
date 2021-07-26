const BaseService = require('./base');
const CustomError = require('../common/error');

class DocumentTypeService extends BaseService {
    constructor(repository, currentUser, storage) {
        super(repository, currentUser);
        this.storage = storage;
        this.containerName = "transdocs";
    }

    async getDocumentTypeByTransactionId(transactionId) {
        try {
            const transInfo = await this.repository.getTransactionInfo(transactionId);
            if (!transInfo) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction is not found!");

            if (!this.currentUser.isAdmin && transInfo.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction is not belongs to you!");

            const include = {
                model: this.repository.models.TransactionDocumentType,
                as: "transactionDocumentTypes",
                where: {
                    transactionId: transactionId
                },
                attributes: ['transactionId', 'documentTypeId', 'container', 'folder', 'fileName', 'updatedAt'],
                required: false
            };

            // Get document type have and not have transaction
            let documentTypes = await this.repository.getByCondition(null, null, include);

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 60);

            // Response
            const requiredDocumentUploaded = [];
            const restOfRequiredDocument = [];
            const optionalDocumentUploaded = [];
            const restOfOptionalDocument = [];
            let canComplete = false;

            documentTypes.forEach(element => {
                let document = {
                    id: element.id,
                    documentTypeName: element.name,
                    isRequired: element.isRequired,
                };
                // **Required**
                if (element.isRequired) {
                    // Uploaded
                    if (element.transactionDocumentTypes.length > 0) {
                        document.fileName = element.transactionDocumentTypes[0].fileName;
                        document.url = element.transactionDocumentTypes[0].accessUrl(this.storage.account, blobSAS);
                        requiredDocumentUploaded.push(document);
                        return;
                    }
                    // Not upload
                    restOfRequiredDocument.push(document);
                    return;
                }
                // **Optinal**
                // Uploaded
                if (element.transactionDocumentTypes.length > 0) {
                    document.fileName = element.transactionDocumentTypes[0].fileName;
                    document.url = element.transactionDocumentTypes[0].accessUrl(this.storage.account, blobSAS);
                    optionalDocumentUploaded.push(document);
                    return;
                }
                // Not upload
                restOfOptionalDocument.push(document);
                return;
            });

            if (restOfRequiredDocument.length === 0) canComplete = true;

            return {
                numberProcessRequired: `${requiredDocumentUploaded.length}/${requiredDocumentUploaded.length + restOfRequiredDocument.length}`,
                numberProcessOptional:`${optionalDocumentUploaded.length}/${optionalDocumentUploaded.length + restOfOptionalDocument.length}`,
                requiredDocumentUploaded: requiredDocumentUploaded,
                optionalDocumentUploaded: optionalDocumentUploaded,
                restOfRequiredDocument: restOfRequiredDocument,
                restOfOptionalDocument: restOfOptionalDocument,
                canComplete: canComplete,
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }
}

module.exports = DocumentTypeService