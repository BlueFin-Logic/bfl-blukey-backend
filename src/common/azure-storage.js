const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters
} = require("@azure/storage-blob");

class AzureStorageService {
    #sharedKeyCredential = null;
    #blobServiceClient = null;

    constructor(account, key) {
        this.account = account;
        this.key = key;
    }

    // Create Shared Key Credential
    createSharedKeyCredential() {
        try {
            return new StorageSharedKeyCredential(this.account, this.key);
        } catch (err) {
            throw err
        }
    }

    set setSharedKeyCredential(data) {
        this.#sharedKeyCredential = data;
    }

    // Create Blob Service Client
    createBlobServiceClient() {
        try {
            return new BlobServiceClient(`https://${this.account}.blob.core.windows.net`, this.#sharedKeyCredential);
        } catch (err) {
            throw err
        }
    }

    set setBlobServiceClient(data) {
        this.#blobServiceClient = data;
    }

    // Get first container => return Promise
    listFirstContainers() {
        try {
            return this.#blobServiceClient.listContainers().next();
        } catch (err) {
            throw err
        }
    }

    // Create container => return Promise
    createContainersIfNotExists(containerName) {
        try {
            return this.#blobServiceClient.getContainerClient(containerName).createIfNotExists({access: "blob"});
        } catch (err) {
            throw err
        }
    }

    // Upload file on container => return Promise
    uploadDataToBlob(containerName, buffer, fileName, mimeType) {
        try {
            return this.#blobServiceClient.getContainerClient(containerName).getBlockBlobClient(`${fileName}`)
                .uploadData(buffer, {
                    blobHTTPHeaders: {
                        blobContentType: mimeType
                    }
                });
        } catch (err) {
            throw err
        }
    }

    // Generate Blob SAS Query
    generateBlobSAS(containerName) {
        try {
            let startsOn = new Date();
            let expiresOn = new Date(startsOn);
            expiresOn.setMinutes(startsOn.getMinutes() + 1);

            let blobSASSignatureValues = {
                containerName,
                permissions: BlobSASPermissions.parse("r"),
                startsOn: startsOn,
                expiresOn: expiresOn
            };

            const blobSAS = generateBlobSASQueryParameters(blobSASSignatureValues, this.#sharedKeyCredential).toString();

            return blobSAS;
        } catch (err) {
            throw err
        }
    }
}

module.exports = AzureStorageService;
