const BaseService = require('./base');
const CustomError = require('../common/error');
const Time = require('../helper/time');

class TransactionDocumentTypeService extends BaseService {
    constructor(repository, currentUser, storage) {
        super(repository, currentUser);
        this.storage = storage;
        this.containerName = "transdocs";
    }

    async upload(transdocsId, dataFile, originalNameFile, mimeTypeFile) {
        try {
            const { transactionId, documentTypeId } = transdocsId;
            const [transaction, transdocsExist] = await Promise.all([
                this.repository.getTransactionInfo(transactionId),
                this.repository.getOne({ transactionId: transactionId, documentTypeId: documentTypeId }, ['documentTypeId'])
            ]);

            if (transaction.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Handler`, "Upload load document is fail. Transaction is not belong to you!");
            if (transaction.transactionStatusId !== 2) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction Status is not In Process. Please change status to In Process before upload document!");
            if (transdocsExist) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction Document Type already exist!");

            const folder = `trans_${transactionId}`;
            await this.storage.createContainersIfNotExists(this.containerName);

            // TODO: Format extension name file.
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
            const documentType = await transDocs.getDocumentType();

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 60);

            const [restOfRequiredDocument,restOfOptionalDocument] = await Promise.all([
                this.repository.getRestDocumentTypeRequired(transactionId, true),
                this.repository.getRestDocumentTypeRequired(transactionId, false),
            ]);

            let canComplete = false;
            if (restOfRequiredDocument.length === 0) canComplete = true;

            return {
                file: {
                    url: transDocs.accessUrl(this.storage.account, blobSAS),
                    transactionId: transDocs.transactionId,
                    documentTypeId: transDocs.documentTypeId,
                    documentTypeName: documentType.name,
                    isRequired: documentType.isRequired,
                    fileName: transDocs.fileName
                },
                restOfRequiredDocument: restOfRequiredDocument,
                restOfOptionalDocument: restOfOptionalDocument,
                canComplete: canComplete
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Handler`, this.tableName, err);
        }
    }

    async delete(transdocsId) {
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
                    attributes: ['id', 'userId', 'transactionStatusId']
                },
                {
                    model: this.repository.models.DocumentType,
                    as: "documentType",
                    attributes: ["id", "name", "isRequired"]
                }
            ]
        )

        if (!transdocsExist) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction Document Type is not exist!");
        if (transdocsExist.transaction.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Handler`, "Delete file uploaded document is fail. Transaction is not belong to you!");
        if (transdocsExist.transaction.transactionStatusId !== 2) throw CustomError.badRequest(`${this.tableName} Handler`, "Transaction Status is not In Process. Please change status to In Process before delete document upload!");


        await this.repository.deleteItem(
            {
                transactionId: transactionId,
                documentTypeId: documentTypeId
            },
            true
        );

        await this.storage.deleteDataOnBlob(this.containerName, `${transdocsExist.folder}/${transdocsExist.fileName}`);

        const [restOfRequiredDocument,restOfOptionalDocument] = await Promise.all([
            this.repository.getRestDocumentTypeRequired(transactionId, true),
            this.repository.getRestDocumentTypeRequired(transactionId, false),
        ]);

        let canComplete = false;
        if (restOfRequiredDocument.length === 0) canComplete = true;

        return {
            file: {
                transactionId: transdocsExist.transactionId,
                documentTypeId: transdocsExist.documentTypeId,
                documentTypeName: transdocsExist.documentType.name,
                isRequired: transdocsExist.documentType.isRequired,
                fileName: transdocsExist.fileName
            },
            restOfRequiredDocument: restOfRequiredDocument,
            restOfOptionalDocument: restOfOptionalDocument,
            canComplete: canComplete
        };
    }
}

module.exports = TransactionDocumentTypeService