const { checkSchema } = require('express-validator');

module.exports.valicateGetUserID = checkSchema({
    id: {
        // The location of the field, can be one or more of body, cookies, headers, params or query.
        // If omitted, all request locations will be checked
        in: ['params', 'query'],
        errorMessage: 'Missing ID',
        isInt: true,
        // Sanitizers can go here as well
        toInt: true,
    }
})