const jwt = require('jsonwebtoken');

class TokenService {
    constructor(token_secret, options) {
        this.token_secret = token_secret;
        this.options = options
    }

    sign(data, userEmail, expiresIn) {
        try {
            this.options.subject = userEmail;
            if (expiresIn) this.options.expiresIn = expiresIn;
            let token = jwt.sign(data, this.token_secret, this.options);
            return token;
        } catch (err) {
            throw err
        }
    }

    verify(token) {
        try {
            let decoded = jwt.verify(token, this.token_secret);
            return decoded;
        } catch (err) {
            throw err
        }
    }
}

module.exports = TokenService;
// this.token_secret = config.tokenJWT.token_secret;
// this.options = {
//     issuer: config.tokenJWT.issuer,
//     subject: config.tokenJWT.subject,
//     audience: config.tokenJWT.audience,
//     algorithm: config.tokenJWT.algorithm,
//     expiresIn: config.tokenJWT.expiresIn
// }
