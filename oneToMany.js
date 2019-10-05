const sequelize = require('./sequelize')
const Sequelize = require('sequelize');
const DATA = require('./DataOneToMany');
const getRandomInt = require('./helpers');

/// MODELS
const tables = { }
tables.CommentImage = sequelize.define('commentImage', {
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

tables.CommentPost = sequelize.define('commentPost', {
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

tables.Post.hasMany(tables.CommentPost, {
    foreignKey: 'commentable_id',
    constraints: true,
    delete: 'CASCADE'
});

tables.CommentPost.belongsTo(tables.Post, {
    foreignKey: 'commentable_id',
    constraints: true,
});

tables.Image.hasMany(tables.CommentImage, {
    foreignKey: 'commentable_id',
    constraints: true,
    delete: 'CASCADE'

});

tables.CommentImage.belongsTo(tables.Image, {
    foreignKey: 'commentable_id',
    constraints: true,

});



const intiDataBase = async () => {
    await sequelize.sync({force: true});
    /// Insert posts

    await Promise.all( DATA.posts.map( async elem => 
         tables.Post.create({...elem})
    ));   

    await Promise.all( DATA.images.map( async elem => 
         tables.Image.create({...elem})
    ));   

    await Promise.all( DATA.comments.images.map( async (elem, index) => 
        tables.CommentImage.create({commentable_id: getRandomInt(1,3), ...elem})
    ));

    await Promise.all( DATA.comments.posts.map( async (elem, index) => 
         tables.CommentPost.create({commentable_id: getRandomInt(1,3), ...elem})
    )); 
}


const run = async () => {
    await intiDataBase();

    const image1 = await tables.Image.findOne({
        where: {
            id: 1
        },
        include: {
            model: tables.CommentImage,
            attributes: [ 'title', 'commentable'],
        },
        raw: true

    })
    console.log("Images 1 with its comments")
    console.log(image1)

    const post1 = await tables.Post.findOne({
        where: {
            id: 1
        },
        include: [tables.CommentPost],
        raw: true

    })    
    console.log("Post 1 with its comments")
    console.log(post1)

    await tables.Post.destroy({ 
        where: {
            id:1
        }
    })

}
  
  
run();

