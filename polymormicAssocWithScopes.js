const {initDataBase, tables} = require('./sequelize')



const run = async () => {
    await initDataBase();

    const image1 = await tables.Image.findOne({
        where: {
            id: 1
        },
        include: {
            model: tables.Comment,
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
        include: [tables.Comment]/*{
            model: tables.Comment,
            required: true,
            attributes: ['url', 'title', 'commentable'],
        }*/,
        raw: true

    })    
    console.log("Post 1 with its comments")
    console.log(post1)

}
  
  
run();

