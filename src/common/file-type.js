const FileType = require('file-type');

class FileTypeService {
    fromBuffer(buffer) {
        try {
            return FileType.fromBuffer(buffer);
        } catch (err) {
            throw err
        }
    }
}

module.exports = new FileTypeService();
