const {MyError} = require('../common/error');
const {MyResponse} = require('../common/response');

module.exports = async (data, req, res, next) => {
    // next is required
    // in prod, don't use console.log or console.err because it is not async
    if (data instanceof MyResponse) {
        res.status(data.code).json(data.getResponse);
        return;
    }
    if (data instanceof MyError) {
        res.status(data.code).json(data.getError);
        return;
    }
    res.status(500).json({message: 'Something went wrong. Please check ErrorHandler.'});
}
