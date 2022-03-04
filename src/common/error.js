class MyError extends Error {
    constructor(namespace, code, message, error) {
        super(message);
        this.name = this.constructor.name;
        this.namespace = namespace;
        this.code = code;
        this.nameSystem = this.#checkNameSystem(error);
        this.messageSystem = this.#checkMessageSystem(error);
        this.stack = this.#checkStack(error);
    }

    #checkNameSystem(error) {
        if (error) return error.name;
        return this.name;
    }

    #checkMessageSystem(error) {
        if (error) return error.message;
        return this.message;
    }

    #checkStack(error) {
        if (error) return error.stack;
        return this.stack;
    }

    get getError() {
        return {
            name: this.name.toString(),
            message: this.message.toString(),
            namespace: this.namespace.toString(),
            code: this.code.toString(),
            nameSystem: this.nameSystem.toString(),
            messageSystem: this.messageSystem.toString(),
            stack: this.stack.toString(),
        };
    }
}
module.exports.MyError = MyError;

module.exports.newError = (namespace, code, message, error = null) => {
    return new MyError(namespace, code, message, error);
}

module.exports.badRequest = (namespace, message, error = null) => {
    return new MyError(namespace, 400, message, error);
}

module.exports.unauthorized = (namespace, message, error = null) => {
    return new MyError(namespace, 401, message, error);
}

module.exports.internal = (namespace, message, error = null) => {
    return new MyError(namespace, 500, message, error);
}

module.exports.forbidden = (namespace, error = null) => {
    return new MyError(namespace, 403, "User do not have permission access this functional!", error);
}

module.exports.cannotListEntity = (namespace, entity, error = null) => {
    return new MyError(namespace, 400, `Cannot list entity: ${entity}!`, error);
}

module.exports.cannotGetEntity = (namespace, entity, error = null) => {
    return new MyError(namespace, 400, `Cannot get entity: ${entity}!`, error);
}

module.exports.cannotCreateEntity = (namespace, entity, error = null) => {
    return new MyError(namespace, 400, `Cannot create entity: ${entity}!`, error);
}

module.exports.cannotUpdateEntity = (namespace, entity, error = null) => {
    return new MyError(namespace, 400, `Cannot update entity: ${entity}!`, error);
}

module.exports.cannotDeleteEntity = (namespace, entity, error = null) => {
    return new MyError(namespace, 400, `Cannot delete entity: ${entity}!`, error);
}

module.exports.cannotRestoreEntity = (namespace, entity, error = null) => {
    return new MyError(namespace, 400, `Cannot restore entity: ${entity}!`, error);
}