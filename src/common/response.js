class CommonResponse {
    constructor(namespace, code, message, data, log) {
        this.namespace = namespace;
        this.code = code;
        this.message = message;
        this.data = data;
        this.log = log;
    }

    static newResponse(namespace, code, message, data, log) {
        return new CommonResponse(namespace, code, message, data, log);
    }
}

module.exports = CommonResponse;
