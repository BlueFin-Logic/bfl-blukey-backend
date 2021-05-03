const CommonError = require('../common/error');

function errorHandler(err, req, res, next) {
    // in prod, don't use console.log or console.err because
    // it is not async
    console.error(err);

    if (err instanceof CommonError) {
        res.status(err.code).json(err.message);
        return;
    }

    res.status(500).json({ message: 'something went wrong.' });
}

module.exports = errorHandler;
