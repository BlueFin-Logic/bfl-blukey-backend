class AppContext {
    constructor(poolMSSQL) {
        this.poolMSSQL = poolMSSQL;
    }

    get poolMSSQL(){
        return this.poolMSSQL;
    }
}

module.exports = AppContext