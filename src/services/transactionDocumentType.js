const BaseService = require('./base');
const CustomError = require('../common/error');
const Time = require('../helper/time');
const CONFIG = require('../config');

class TransactionDocumentTypeService extends BaseService {
    constructor(repository, currentUser, storage) {
        super(repository, currentUser);
        this.storage = storage;
        this.containerName = CONFIG.azureStorage.containerTransaction;
    }

    async upload(transdocsId, dataFile, originalNameFile, mimeTypeFile) {
        try {
            const { transactionId, documentTypeId } = transdocsId;
            const [transaction, documentType, transdocsExist] = await Promise.all([
                this.repository.getTransactionInfo(transactionId),
                this.repository.getDocumentTypeInfo(documentTypeId),
                this.repository.getOne({ transactionId: transactionId, documentTypeId: documentTypeId }, ['documentTypeId'])
            ]);

            // Check document type valid.
            if (!documentType || !transaction) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction and Document Type upload is not in database!");
            // Check transaction is belong to user.
            if (transaction.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Service`, "Upload load document is fail. Transaction is not belong to you!");
            const typeTransaction = transaction.isListing ? "Listing" : "Buying";
            const typeDocType = documentType.isListing ? "Listing" : "Buying";
            // Check document type valid is same type as transaction.
            if (!documentType.isBoth && (transaction.isListing !== documentType.isListing)) throw CustomError.badRequest(`${this.tableName} Service`, `Document Type (${typeDocType}) upload is not the same type as Transaction (${typeTransaction})!`);
            // Check transaction status is IN PROCESS (2)
            if (transaction.transactionStatusId !== 2) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction Status is not In Process. Please change status to In Process before upload document!");
            // Check file is not uploaded and not inserted into table TransactionDocumentType
            if (transdocsExist) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction Document Type already exist!");

            const folder = `trans_${transactionId}`;
            await this.storage.createContainersIfNotExists(this.containerName);

            const fileName = `${documentTypeId}_${Time.getCurrentUnixTimestamp()}_${originalNameFile}`;
            await this.storage.uploadDataOnBlob(this.containerName, dataFile, fileName, folder, mimeTypeFile);

            const data = {
                transactionId: transactionId,
                documentTypeId: documentTypeId,
                container: this.containerName,
                folder: folder,
                fileName: fileName
            };

            const transDocs = await this.repository.addItem(data);

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 60);

            const [restOfRequiredDocument,restOfOptionalDocument] = await Promise.all([
                this.repository.getRestDocumentType(transactionId, true, transaction.isListing),
                this.repository.getRestDocumentType(transactionId, false, transaction.isListing),
            ]);

            let canComplete = false;
            if (restOfRequiredDocument.length === 0) canComplete = true;

            return {
                transactionIsListing: transaction.isListing,
                canComplete: canComplete,
                file: {
                    url: transDocs.accessUrl(this.storage.account, blobSAS),
                    transactionId: transDocs.transactionId,
                    documentTypeId: transDocs.documentTypeId,
                    documentTypeName: documentType.name,
                    isRequired: documentType.isRequired,
                    isListing: documentType.isListing,
                    isBoth: documentType.isBoth,
                    fileName: transDocs.fileName
                },
                restOfRequiredDocument: restOfRequiredDocument,
                restOfOptionalDocument: restOfOptionalDocument
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(transdocsId) {
        try {
            const { transactionId, documentTypeId } = transdocsId;

            const transdocsExist = await this.repository.getOne(
                {
                    transactionId: transactionId,
                    documentTypeId: documentTypeId
                },
                ['transactionId', 'documentTypeId', 'container', 'folder', 'fileName'],
                [
                    {
                        model: this.repository.models.Transaction,
                        as: "transaction",
                        attributes: ['id', 'userId', 'transactionStatusId', 'isListing']
                    },
                    {
                        model: this.repository.models.DocumentType,
                        as: "documentType",
                        attributes: ["id", "name", "isRequired", "isListing", "isBoth"]
                    }
                ]
            )

            // Check TransactionDocumentType have record into database.
            if (!transdocsExist) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction Document Type is not uploaded!");
            // Check transaction is belong to user.
            if (transdocsExist.transaction.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Service`, "Delete file uploaded document is fail. Transaction is not belong to you!");
            // Check transaction status is IN PROCESS (2)
            if (transdocsExist.transaction.transactionStatusId !== 2) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction Status is not In Process. Please change status to In Process before delete document upload!");


            await this.repository.deleteItem(
                {
                    transactionId: transactionId,
                    documentTypeId: documentTypeId
                },
                true // Hard delete
            );

            await this.storage.deleteDataOnBlob(this.containerName, `${transdocsExist.folder}/${transdocsExist.fileName}`);

            const [restOfRequiredDocument, restOfOptionalDocument] = await Promise.all([
                this.repository.getRestDocumentType(transactionId, true, transdocsExist.transaction.isListing),
                this.repository.getRestDocumentType(transactionId, false, transdocsExist.transaction.isListing),
            ]);

            let canComplete = false;
            if (restOfRequiredDocument.length === 0) canComplete = true;

            return {
                transactionIsListing: transdocsExist.transaction.isListing,
                canComplete: canComplete,
                file: {
                    transactionId: transdocsExist.transactionId,
                    documentTypeId: transdocsExist.documentTypeId,
                    documentTypeName: transdocsExist.documentType.name,
                    isRequired: transdocsExist.documentType.isRequired,
                    isListing: transdocsExist.documentType.isListing,
                    isBoth: transdocsExist.documentType.isBoth,
                    fileName: transdocsExist.fileName
                },
                restOfRequiredDocument: restOfRequiredDocument,
                restOfOptionalDocument: restOfOptionalDocument
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = TransactionDocumentTypeService