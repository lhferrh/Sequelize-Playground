const {sequelize, tables} = require('./sequelize')
const getRandomInt = require('./helpers')
const DATA = require('./DATA')

const imagesSize = DATA.images.length;
const postsSize = DATA.posts.length;

sequelize.sync({force : true}).then( () => {

    DATA.images.map( img => {
        tables.Image.create(img)
    }) 

    DATA.posts.map( info => {
        tables.Post.create(info)
    }) 
    
    DATA.comments.images.map( info => {
        tables.Comment.create( {...info, commentable_id: getRandomInt(1, imagesSize) });
    }) 

    DATA.comments.posts.map( info => {
        tables.Comment.create( {...info, commentable_id: getRandomInt(1, postsSize) });
    }) 


    }
)



  
  

