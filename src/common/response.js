class MyResponse {
    constructor(namespace, code, message, data, paging, filter) {
        this.namespace = namespace;
        this.code = code;
        this.message = message;
        this.data = data;
        this.paging = this.#fillPaging(paging);
        this.filter = filter;
    }

    #fillPaging(paging) {
        if (paging) return {
            page: paging.page,
            total: paging.total
        };
        return null;
    }

    get getResponse() {
        return {
            namespace: this.namespace,
            code: this.code,
            message: this.message,
            data: this.data,
            paging: this.paging,
            filter: this.filter
        };
    }
}
module.exports.MyResponse = MyResponse;

module.exports.newResponse = (namespace, code, message, data, paging, filter) => {
    return new MyResponse(namespace, code, message, data, paging, filter);
}

module.exports.newSuccessResponse = (namespace, message, data, paging, filter) => {
    return new MyResponse(namespace, 200, message, data, paging, filter);
}

module.exports.newCreatedResponse = (namespace, message, data) => {
    return new MyResponse(namespace, 201, message, data, null, null);
}

module.exports.newSimpleResponse = (namespace, message, data) => {
    return new MyResponse(namespace, 200, message, data, null, null);
}