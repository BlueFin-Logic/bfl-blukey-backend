const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters
} = require("@azure/storage-blob");
const Utilities = require('../helper/utilities')

class AzureStorageService {
    constructor(account, key) {
        this.account = account;
        this.key = key;
        this.storageSharedKeyCredential = new StorageSharedKeyCredential(this.account, this.key);
        this.blobServiceClient = new BlobServiceClient(`https://${this.account}.blob.core.windows.net`, this.storageSharedKeyCredential);
    }

    // Get first container => return Promise
    listFirstContainers() {
        try {
            return this.blobServiceClient.listContainers().next();
        } catch (err) {
            throw err
        }
    }

    // Create container => return Promise
    createContainersIfNotExists(containerName) {
        try {
            return this.blobServiceClient.getContainerClient(containerName).createIfNotExists({access: "blob"});
        } catch (err) {
            throw err
        }
    }

    // Upload file on container => return Promise
    uploadDataOnBlob(containerName, buffer, fileName, folder, mimeType) {
        try {
            return this.blobServiceClient.getContainerClient(containerName).getBlockBlobClient(`${folder}/${fileName}`)
                .uploadData(buffer, {
                    blobHTTPHeaders: {
                        blobContentType: mimeType
                    }
                });
        } catch (err) {
            throw err
        }
    }

    // Delete file on container => return Promise
    deleteDataOnBlob(containerName, fileName) {
        try {
            return this.blobServiceClient.getContainerClient(containerName).getBlockBlobClient(`${fileName}`)
                .deleteIfExists();
        } catch (err) {
            throw err
        }
    }

    // Generate Blob SAS Query
    generateBlobSAS(containerName, minutes) {
        try {
            let time = Utilities.parseInt(minutes, 5)
            let startsOn = new Date();
            let expiresOn = new Date(startsOn);
            expiresOn.setMinutes(startsOn.getMinutes() + time);

            let blobSASSignatureValues = {
                containerName,
                permissions: BlobSASPermissions.parse("r"),
                startsOn: startsOn,
                expiresOn: expiresOn
            };

            const blobSAS = generateBlobSASQueryParameters(blobSASSignatureValues, this.storageSharedKeyCredential).toString();

            return blobSAS;
        } catch (err) {
            throw err
        }
    }
}

module.exports = AzureStorageService;
