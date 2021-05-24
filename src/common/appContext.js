class AppContext {
    #poolMSSQL = null;
    #tokenJWT = null;

    set setPoolMSSQL(poolMSSQL){
        this.#poolMSSQL = poolMSSQL;
    }

    get getPoolMSSQL(){
        return this.#poolMSSQL;
    }

    set setTokenJWT(tokenJWT){
        this.#tokenJWT = tokenJWT;
    }

    get getTokenJWT(){
        return this.#tokenJWT;
    }
}

module.exports = AppContext