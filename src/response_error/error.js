class CustomError extends Error {
    constructor(namespace, code, message, rootError) {
        super(message);
        this.namespace = namespace;
        this.code = code;
        this.rootError = this.#findRootError(rootError);
        this.name = this.constructor.name;
        // this.log = log;
    }

    #findRootError(rootError) {
        if (rootError) return rootError;
        return new Error(this.message);
    };

    get getRooError() {
        return {
            name: this.rootError?.name.toString(),
            message: this.rootError?.message.toString(),
            rootError: this.rootError?.toString(),
            stack: this.rootError?.stack.toString()
        };
    }

    static newError(namespace, code, message, rootError = null) {
        return new CustomError(namespace, code, message, rootError);
    }

    static badRequest(namespace, message, rootError = null) {
        return new CustomError(namespace, 400, message, rootError);
    }

    static unauthorized(namespace, message, rootError = null) {
        return new CustomError(namespace, 401, message, rootError);
    }

    static forbidden(namespace, message, rootError = null) {
        return new CustomError(namespace, 403, message, rootError);
    }

    static internal(namespace, message, rootError = null) {
        return new CustomError(namespace, 500, message, rootError);
    }

    static database(namespace, rootError = null) {
        return new CustomError(namespace, 500, "Something went wrong with Database.", rootError);
    }

    static cannotListEntity(namespace, entity, rootError = null) {
        return new CustomError(namespace, 400, `Cannot list entity: ${entity}.`, rootError);
    }

    static cannotGetEntity(namespace, entity, rootError = null) {
        return new CustomError(namespace, 400, `Cannot get entity: ${entity}.`, rootError);
    }

    static cannotCreateEntity(namespace, entity, rootError = null) {
        return new CustomError(namespace, 401, `Cannot create entity: ${entity}.`, rootError);
    }

    static cannotUpdateEntity(namespace, entity, rootError = null) {
        return new CustomError(namespace, 401, `Cannot update entity: ${entity}.`, rootError);
    }

    static cannotDeleteEntity(namespace, entity, rootError = null) {
        return new CustomError(namespace, 401, `Cannot delete entity: ${entity}.`, rootError);
    }
}

module.exports = CustomError;
