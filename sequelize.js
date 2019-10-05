
const Sequelize = require('sequelize');
const mysqlConfig = require('./mysqlConfig');


const sequelize = new Sequelize(
    mysqlConfig.dbName,
    mysqlConfig.user,
    mysqlConfig.password,
    {
        host: mysqlConfig.host.proxy,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
    })
    .catch(err => {
    console.error('Unable to connect to the database:', err);
    });
    

module.exports = sequelize;
