class CommonError {
    constructor(namespace, code, message, rootError, log) {
        this.namespace = namespace;
        this.code = code;
        this.message = message;
        this.rootError = rootError;
        this.log = log;
    }

    static newError(namespace, code, message, rootError, log) {
        return new CommonError(namespace, code, message, rootError, log);
    }

    static badRequest(namespace, message, rootError, log) {
        return new CommonError(namespace, 400, message, rootError, log);
    }

    static unauthorized(namespace, message, rootError, log) {
        return new CommonError(namespace, 401, message, rootError, log);
    }

    static forbidden(namespace, message, rootError, log) {
        return new CommonError(namespace, 403, message, rootError, log);
    }

    static internal(namespace, message, rootError, log) {
        return new CommonError(namespace, 500, message, rootError, log);
    }

    static database(namespace, rootError, log) {
        return this.badRequest(namespace, "something went wrong with DB.", rootError, log);
    }

    static cannotListEntity(namespace, entity, rootError, log) {
        return this.badRequest(namespace, `Cannot list entity: ${entity.toUpperCase()}.`, rootError, log);
    }
    
    static cannotGetEntity(namespace, entity, rootError, log) {
        return this.badRequest(namespace, `Cannot get entity: ${entity.toUpperCase()}.`, rootError, log);
    }

    static cannotCreateEntity(namespace, entity, rootError, log) {
        return this.badRequest(namespace, `Cannot create entity: ${entity.toUpperCase()}.`, rootError, log);
    }

    static cannotUpdateEntity(namespace, entity, rootError, log) {
        return this.badRequest(namespace, `Cannot update entity: ${entity.toUpperCase()}.`, rootError, log);
    }

    static cannotDeleteEntity(namespace, entity, rootError, log) {
        return this.badRequest(namespace, `Cannot delete entity: ${entity.toUpperCase()}.`, rootError, log);
    }
}

module.exports = CommonError;
