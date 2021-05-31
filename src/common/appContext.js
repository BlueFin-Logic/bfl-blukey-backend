class AppContext {
    #db = null;
    #tokenJWT = null;
    #storage = null;

    set setDB(db){
        this.#db = db;
    }

    get getDB(){
        return this.#db;
    }

    set setTokenJWT(tokenJWT){
        this.#tokenJWT = tokenJWT;
    }

    get getTokenJWT(){
        return this.#tokenJWT;
    }

    set setStorage(storage){
        this.#storage = storage;
    }

    get getStorage(){
        return this.#storage;
    }
}

module.exports = AppContext