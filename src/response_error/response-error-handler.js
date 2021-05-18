const CustomError = require('./error');
const CustomResponse = require('./response');

async function responseErrorHandler(data, req, res, next) {
    // next is required
    // in prod, don't use console.log or console.err because it is not async
    if (data instanceof CustomResponse) {
        res.status(data.code).json({
            name: data.name,
            code: data.code,
            namespace: data.namespace,
            message: data.message,
            data: data.data,
            paging: data.paging,
            filter: data.filter
        })
        return;
    }
    if (data instanceof CustomError) {
        res.status(data.code).json({
            name: data.name,
            code: data.code,
            namespace: data.namespace,
            message: data.message,
            rootError: data.getRooError
        })
        return;
    }
    res.status(500).json({message: 'Something went wrong. Please check ErrorHandler.'});
}

module.exports = responseErrorHandler;
