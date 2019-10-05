const sequelize = require('./sequelize')
const Sequelize = require('sequelize');
const DATA = require('./DataTestManyToMany');
const getRandomInt = require('./helpers');


const User = sequelize.define('user', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
          type: Sequelize.STRING,
      }, 

    } 
);
  
const Project = sequelize.define('project', {
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
    }
  }
);

  Project.belongsToMany(User, {through: 'UserProject'});
  User.belongsToMany(Project, {through: 'UserProject'});


const intiDataBase = async () => {
    await sequelize.sync({force: true});
}

const run = async () => {
    const max = 3;
    await intiDataBase();

    await Promise.all( DATA.users.map( async elem=> 
         User.create({...elem})
    ))

    await Promise.all( DATA.projects.map( async elem => 
        Project.create({...elem})
   ))

   let user, project;
   for( let i = 1 ; i < 4 ; i++ ){
       user = await User.findOne({
           where:
            {
                userId: i
            },
            raw:true
        });
        project = await Project.findOne({
            where:
             {
                 projectId: i
             },
             raw:true
         });
        
        console.log(user);
        console.log(project);
        user.addProject(project)
   }
   /*

   const project = await Users.findAll({
       include: [{
        model: Cars,
        through: {
            attributes: ['make'],
           
          }
        //attributes: ['make'],
        }],
        raw: true
   });

   const favorites = await Favorites.findAll({
        where:{
            userId:2
        },
        raw: true
    });

   console.log(car);
   console.log(favorites);

   console.log(Users.getCars())
   */
} 
  
run();

