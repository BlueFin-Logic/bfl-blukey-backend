const {Sequelize, DataTypes, Model} = require('sequelize');
const Models = require('./init-models')

module.exports = (config) => {
    try {
        const sequelize = new Sequelize(config.database, config.user, config.password, {
            host: config.server,
            dialect: "mssql",
            define: {
                freezeTableName: true
            },
            logQueryParameters: true,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: (sql, timing) => console.log({
                sql: sql,
                timing: timing
            }),
            benchmark: true
        });

        const models = Models(sequelize, DataTypes, Model);

        return {
            models: models,
            sequelize: sequelize,
        };
    } catch (error) {
        throw error;
    }
}