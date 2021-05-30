const FileType = require('file-type');

class FileTypeService {
    fromBuffer(data) {
        try {
            return FileType.fromBuffer(data);
        } catch (err) {
            throw err
        }
    }
}

module.exports = new FileTypeService();
