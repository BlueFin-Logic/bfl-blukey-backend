const jwt = require('jsonwebtoken');

class TokenService {
    constructor(tokenSecret, options) {
        this.tokenSecret = tokenSecret;
        this.options = options
    }

    sign(data, userEmail, expiresIn) {
        try {
            this.options.subject = userEmail;
            let options = JSON.parse(JSON.stringify(this.options));
            if (expiresIn) options.expiresIn = expiresIn;
            let token = jwt.sign(data, this.tokenSecret, options);
            return token;
        } catch (err) {
            throw err
        }
    }

    verify(token) {
        try {
            let decoded = jwt.verify(token, this.tokenSecret);
            return decoded;
        } catch (err) {
            throw err
        }
    }
}

module.exports = TokenService;