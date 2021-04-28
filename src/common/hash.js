const bcrypt = require('bcrypt');
const objectHash = require('object-hash');

class HashService {
    constructor() {
    }

    async genSalt(length) {
        return await bcrypt.genSalt(length);
    }

    hashMD5(data) {
        return objectHash(data, { algorithm: 'md5', encoding: 'base64' });
    }
}

module.exports.HashService = new HashService();