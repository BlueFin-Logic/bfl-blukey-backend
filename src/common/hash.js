let bcrypt = require('bcrypt');
const objectHash = require('object-hash');

class HashService {
    genSalt(length) {
        try {
            return bcrypt.genSaltSync(length);
        } catch (err) {
            throw err;
        }
    }

    hashMD5(data) {
        try {
            return objectHash(data, { algorithm: 'md5', encoding: 'base64' });
        } catch (err) {
            throw err;
        }
    }
}

module.exports.HashService = new HashService();