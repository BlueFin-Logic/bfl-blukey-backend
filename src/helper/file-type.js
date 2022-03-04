const FileType = require('file-type');

module.exports.fromBuffer = (buffer) => {
    try {
        return FileType.fromBuffer(buffer);
    } catch (err) {
        throw err
    }
}
