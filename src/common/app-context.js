class AppContext {
    #db = null;
    #tokenJWT = null;
    #storage = null;
    #email = null;

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

    set setEmail(email){
        this.#email = email;
    }

    get getEmail(){
        return this.#email;
    }
}

module.exports = new AppContext()