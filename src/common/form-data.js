const multer = require('multer');

class FormDataService {
    config(...args) {
        try {
            let storage = multer.memoryStorage();
            let upload = multer({
                storage: storage,
                limits: {
                    fieldSize: 1048576,
                }
            }).single('pdf');
            return new Promise((resolve, reject) => {
                upload(...args, err => {
                    if (err instanceof multer.MulterError) return reject(err);
                    else if (err) return reject(err);
                    resolve();
                })
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new FormDataService();
