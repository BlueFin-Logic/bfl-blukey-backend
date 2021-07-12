const hash = require('object-hash');

module.exports.hashSHA1 = (value) => {
    try {
        return hash(value, {algorithm: 'sha1', encoding: 'hex'});
    } catch (err) {
        throw err
    }
}

module.exports.hashMD5 = (value) => {
    try {
        return hash(value, {algorithm: 'md5', encoding: 'hex'});
    } catch (err) {
        throw err
    }
}

module.exports.hashPassword = (username, value) => {
    try {
        const pass = value + hash(username, {algorithm: 'sha1', encoding: 'hex'});
        return hash(pass, {algorithm: 'md5', encoding: 'hex'});
    } catch (err) {
        throw err
    }
}