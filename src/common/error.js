class CustomError extends Error {
    constructor(namespace, code, message, rootError) {
        super(message);
        this.namespace = namespace;
        this.code = code;
        this.rootError = this.#findRootError(rootError);
        this.name = this.constructor.name;
    }

    #findRootError(rootError) {
        if (rootError) return rootError;
        return new Error(this.message);
    }

    get getRooError() {
        return {
            name: this.rootError?.name.toString(),
            message: this.rootError?.message.toString(),
            rootError: this.rootError?.toString(),
            stack: this.rootError?.stack.toString()
        };
    }
}
module.exports.CustomError = CustomError;

module.exports.newError = (namespace, code, message, rootError = null) => {
    return new CustomError(namespace, code, message, rootError);
}

module.exports.badRequest = (namespace, message, rootError = null) => {
    return new CustomError(namespace, 400, message, rootError);
}

module.exports.unauthorized = (namespace, message, rootError = null) => {
    return new CustomError(namespace, 401, message, rootError);
}

module.exports.internal = (namespace, message, rootError = null) => {
    return new CustomError(namespace, 500, message, rootError);
}

module.exports.forbidden = (namespace, rootError = null) => {
    return new CustomError(namespace, 403, "User do not have permission access this functional.", rootError);
}

module.exports.database = (namespace, rootError = null) => {
    return new CustomError(namespace, 500, "Something went wrong with Database.", rootError);
}

module.exports.cannotListEntity = (namespace, entity, rootError = null) => {
    return new CustomError(namespace, 400, `Cannot list entity: ${entity}.`, rootError);
}

module.exports.cannotGetEntity = (namespace, entity, rootError = null) => {
    return new CustomError(namespace, 400, `Cannot get entity: ${entity}.`, rootError);
}

module.exports.cannotCreateEntity = (namespace, entity, rootError = null) => {
    return new CustomError(namespace, 401, `Cannot create entity: ${entity}.`, rootError);
}

module.exports.cannotUpdateEntity = (namespace, entity, rootError = null) => {
    return new CustomError(namespace, 401, `Cannot update entity: ${entity}.`, rootError);
}

module.exports.cannotDeleteEntity = (namespace, entity, rootError = null) => {
    return new CustomError(namespace, 401, `Cannot delete entity: ${entity}.`, rootError);
}