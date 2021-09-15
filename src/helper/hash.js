// const hash = require('object-hash');

// module.exports.hashSHA1 = (value) => {
//     try {
//         return hash(value, {algorithm: 'sha1', encoding: 'hex'});
//     } catch (err) {
//         throw err
//     }
// }

// module.exports.hashMD5 = (value) => {
//     try {
//         return hash(value, {algorithm: 'md5', encoding: 'hex'});
//     } catch (err) {
//         throw err
//     }
// }

// module.exports.hashPassword = (username, value) => {
//     try {
//         const pass = value + hash(username, {algorithm: 'sha1', encoding: 'hex'});
//         return hash(pass, {algorithm: 'md5', encoding: 'hex'});
//     } catch (err) {
//         throw err
//     }
// }

const hash = require('bcrypt');

module.exports.hashPassword = (value) => {
    try {
        return hash.hashSync(value, 10);
    } catch (err) {
        throw err
    }
}

module.exports.compareHash = (value, encrypted) => {
    try {
        return hash.compare(value, encrypted);
    } catch (err) {
        throw err
    }
}