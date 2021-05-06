class AppContext {
    constructor() {
        // this.configMSSQL = configMSSQL;
        // this.tokenJWT = tokenJWT;
        this.poolMSSQL = null;
    }

    // set setPoolMSSQL(poolMSSQL){
    //     this.#poolMSSQL = poolMSSQL
    // }

    // get getPoolMSSQL(){
    //     this.#poolMSSQL;
    // }

    createAppContext(poolMSSQL){
        this.poolMSSQL = poolMSSQL;
    }

    // async getPoolMSSQL(){
    //     try {
    //         return await sql.connect(configMSSQL);
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }

    // get configMSSQL(){
    //     return this.configMSSQL
    // }
    // set configMSSQL(configMSSQL){
    //     return this.configMSSQL = configMSSQL
    // }
}

module.exports = AppContext