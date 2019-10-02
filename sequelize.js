
const Sequelize = require('sequelize');

const mysqlConfig = {
    host: {
        proxy: "127.0.0.1",
        remote: "127.0.0.1"
    },
    user: "root",
    password: "123456",
    port: 3306,
    dbName: "test"
};


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
    

/// MODELS

const tables = { }
tables.Comment = sequelize.define('comment', {
    title: Sequelize.STRING,
    commentable: Sequelize.STRING,
    commentable_id: Sequelize.INTEGER
    }, {
    instanceMethods: {
        getItem: function() {
        return this['get' + this.get('commentable').substr(0, 1).toUpperCase() + this.get('commentable').substr(1)]();
        }
    }
});

tables.Post = sequelize.define('post', {
    title: Sequelize.STRING,
    });

    tables.Image = sequelize.define('image', {
    url: Sequelize.STRING,
});


/// ASSOCIATIONS

tables.Post.hasMany(tables.Comment, {
    foreignKey: 'commentable_id',
    constraints: false,
    scope: {
        commentable: 'post'
    }
});

tables.Comment.belongsTo(tables.Post, {
    foreignKey: 'commentable_id',
    constraints: false,
    as: 'post'
});

tables.Image.hasMany(tables.Comment, {
    foreignKey: 'commentable_id',
    constraints: false,
    scope: {
        commentable: 'image'
    }
});

tables.Comment.belongsTo(tables.Image, {
    foreignKey: 'commentable_id',
    constraints: false,
    as: 'image'
});


module.exports = { sequelize, tables };