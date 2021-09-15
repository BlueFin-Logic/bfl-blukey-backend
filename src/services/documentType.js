const BaseService = require('./base');
const CustomError = require('../common/error');
const CONFIG = require('../config');
const FIRST_ITEM = 0;
const {Op} = require('sequelize');

class DocumentTypeService extends BaseService {
    constructor(repository, currentUser, storage) {
        super(repository, currentUser);
        this.storage = storage;
        this.containerName = CONFIG.azureStorage.containerTransaction;
    }

    async getDocumentTypeByTransactionId(transactionId) {
        try {
            const transInfo = await this.repository.getTransactionInfo(transactionId);
            if (!transInfo) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction is not found!");

            if (!this.currentUser.isAdmin && transInfo.userId !== this.currentUser.id) throw CustomError.badRequest(`${this.tableName} Service`, "Transaction is not belongs to you!");

            const include = {
                model: this.repository.models.TransactionDocumentType,
                as: "transactionDocumentTypes",
                where: {
                    transactionId: transactionId
                },
                attributes: ['transactionId', 'documentTypeId', 'container', 'folder', 'fileName', 'updatedAt'],
                required: false
            };

            // Get document type have and NOT have transaction
            let documentTypes = await this.repository.getByCondition(null, null, include);

            const blobSAS = this.storage.generateBlobSAS(this.containerName, 60);

            // Response
            const listing = {
                required: {
                    uploaded: [],
                    rest: []
                },
                optional: {
                    uploaded: [],
                    rest: []
                }
            };
            const buying = {
                required: {
                    uploaded: [],
                    rest: []
                },
                optional: {
                    uploaded: [],
                    rest: []
                }
            };

            documentTypes.forEach(element => {
                let document = {
                    id: element.id,
                    documentTypeName: element.name,
                    isRequired: element.isRequired,
                    isListing: element.isListing,
                    isBoth: element.isBoth,
                    // fileName: null,
                    // url: null
                };
                // **Required**
                if (element.isRequired) {
                    // Uploaded
                    if (element.transactionDocumentTypes.length > 0) {
                        document.fileName = element.transactionDocumentTypes[FIRST_ITEM].fileName;
                        document.url = element.transactionDocumentTypes[FIRST_ITEM].accessUrl(this.storage.account, blobSAS);
                        // Both and Listing
                        if (element.isBoth && transInfo.isListing) {
                            listing.required.uploaded.push(document);
                            return;
                        }
                        // Both and Buying
                        if (element.isBoth && !transInfo.isListing) {
                            buying.required.uploaded.push(document);
                            return;
                        }
                        // Listing
                        if (element.isListing) {
                            listing.required.uploaded.push(document);
                            return;
                        }
                        // Buying
                        buying.required.uploaded.push(document);
                        return;
                    }
                    // Not upload
                    // Both and Listing
                    if (element.isBoth && transInfo.isListing) {
                        listing.required.rest.push(document);
                        return;
                    }
                    // Both and Buying
                    if (element.isBoth && !transInfo.isListing) {
                        buying.required.rest.push(document);
                        return;
                    }
                    // Listing
                    if (element.isListing) {
                        listing.required.rest.push(document);
                        return;
                    }
                    // Buying
                    buying.required.rest.push(document);
                    return;
                }

                // **Optinal**
                // Uploaded
                if (element.transactionDocumentTypes.length > 0) {
                    document.fileName = element.transactionDocumentTypes[FIRST_ITEM].fileName;
                    document.url = element.transactionDocumentTypes[FIRST_ITEM].accessUrl(this.storage.account, blobSAS);
                    // Both and Listing
                    if (element.isBoth && transInfo.isListing) {
                        listing.optional.uploaded.push(document);
                        return;
                    }
                    // Both and Buying
                    if (element.isBoth && !transInfo.isListing) {
                        buying.optional.uploaded.push(document);
                        return;
                    }
                    // Listing
                    if (element.isListing) {
                        listing.optional.uploaded.push(document);
                        return;
                    }
                    // Buying
                    buying.optional.uploaded.push(document);
                    return;
                }
                // Not upload
                // Both and Listing
                if (element.isBoth && transInfo.isListing) {
                    listing.optional.rest.push(document);
                    return;
                }
                // Both and Buying
                if (element.isBoth && !transInfo.isListing) {
                    buying.optional.rest.push(document);
                    return;
                }
                // Listing
                if (element.isListing) {
                    listing.optional.rest.push(document);
                    return;
                }
                // Buying
                buying.optional.rest.push(document);
                return;
            });

            let canComplete = false;
            let numberProcessRequired = "";
            let numberProcessOptional = "";

            // Listing
            if (transInfo.isListing) {
                if (listing.required.rest.length === 0) canComplete = true;
                numberProcessRequired = `${listing.required.uploaded.length}/${listing.required.uploaded.length + listing.required.rest.length}`;
                numberProcessOptional = `${listing.optional.uploaded.length}/${listing.optional.uploaded.length + listing.optional.rest.length}`;
            }
            // Buying
            if (!transInfo.isListing) {
                if (buying.required.rest.length === 0) canComplete = true;
                numberProcessRequired = `${buying.required.uploaded.length}/${buying.required.uploaded.length + buying.required.rest.length}`;
                numberProcessOptional = `${buying.optional.uploaded.length}/${buying.optional.uploaded.length + buying.optional.rest.length}`;
            }

            return {
                transactionId: transInfo.id,
                transactionIsListing: transInfo.isListing,
                canComplete: canComplete,
                numberProcessRequired: numberProcessRequired,
                numberProcessOptional: numberProcessOptional,
                listing: listing,
                buying: buying
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getAll(page, limit, query) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const conditions = {};
            if (query.name) conditions.name = { [Op.substring]: `${query.name}` };
            if (query.isRequired) conditions.isRequired = query.isRequired;
            if (query.isListing) conditions.isRequired = query.isListing;
            if (query.isBoth) conditions.isBoth = query.isBoth;
            const {count, rows} = await this.repository.getAll(page, limit, conditions);
            return {
                total: count,
                data: rows
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getById(documentTypeId) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const documentType = await this.repository.getById(documentTypeId);
            // Check user is exist.
            if (!documentType) throw CustomError.badRequest(`${this.tableName} Service`, "Document Type is not found!");
            return documentType;
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const result = await this.repository.addItem(data);
            return {
                id: result.id
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async update(documentTypeId, data) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const documentTypeExist = await this.repository.getById(documentTypeId, ['id']);
            if (!documentTypeExist) throw CustomError.badRequest(`${this.tableName} Service`, "Document Type is not found!");
            let result = await this.repository.updateItem(data, { id: documentTypeId });
            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(documentTypeId) {
        try {
            if (!this.currentUser.isAdmin) throw CustomError.forbidden(`${this.tableName} Service`);
            const [documentTypeExist, documentTypeIsUsed] = await Promise.all([
                this.repository.getById(documentTypeId, ['name']),
                this.repository.getDocumentTypeIsUsed(documentTypeId)
            ])
            if (!documentTypeExist || documentTypeIsUsed) throw CustomError.badRequest(`${this.tableName} Service`, "Document Type is not found or is used by transaction!");
            await this.repository.deleteItem({ id: documentTypeId });
            return {
                id: documentTypeId
            }
        } catch (err) {
            if (err instanceof CustomError.CustomError) throw err;
            throw CustomError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = DocumentTypeService