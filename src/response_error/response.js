class CustomResponse {
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
    };

    static newResponse(namespace, code, message, data, paging, filter) {
        return new CustomResponse(namespace, code, message, data, paging, filter);
    }

    static newSuccessResponse(namespace, message, data, paging, filter) {
        return new CustomResponse(namespace, 200, message, data, paging, filter);
    }

    static newCreatedResponse(namespace, message, data) {
        return new CustomResponse(namespace, 201, message, data, null, null);
    }

    static newSimpleResponse(namespace, message, data) {
        return new CustomResponse(namespace, 200, message, data, null, null);
    }
}

module.exports = CustomResponse;
