class AppContext {
    #db;
    #sequelize;
    #tokenJWT;
    #storage;
    #email;
    #loggingDb;

    constructor(db, sequelize, tokenJWT, storage, email, loggingDb) {
        this.#db = db;
        this.#sequelize = sequelize;
        this.#tokenJWT = tokenJWT;
        this.#storage = storage;
        this.#email = email;
        this.#loggingDb = loggingDb;
    }

    // set setDB(db){
    //     this.#db = db;
    // }

    get getDB(){
        return this.#db;
    }

    get getTokenJWT(){
        return this.#tokenJWT;
    }

    get getStorage(){
        return this.#storage;
    }

    get getEmail(){
        return this.#email;
    }

    get getSequelize(){
        return this.#sequelize;
    }

    get getloggingDb(){
        return this.#loggingDb;
    }
}

module.exports = AppContext