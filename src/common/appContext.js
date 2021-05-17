class AppContext {
    #poolMSSQL = null;
    constructor() {
        // this.tokenJWT = tokenJWT;
        this.#poolMSSQL = null;
    }

    set setPoolMSSQL(poolMSSQL){
        this.#poolMSSQL = poolMSSQL;
    }

    get getPoolMSSQL(){
        return this.#poolMSSQL;
    }
}

module.exports = AppContext