class AppContext {
    #db;
    #sequelize;
    #tokenJWT;
    #storage;
    #email;
    #loggingDb;
    #session;

    constructor(db, sequelize, tokenJWT, storage, email, loggingDb, session) {
        this.#db = db;
        this.#sequelize = sequelize;
        this.#tokenJWT = tokenJWT;
        this.#storage = storage;
        this.#email = email;
        this.#loggingDb = loggingDb;
        this.#session = session;
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

    get getLoggingDb(){
        return this.#loggingDb;
    }

    get getSession(){
        return this.#session;
    }
}

module.exports = AppContext