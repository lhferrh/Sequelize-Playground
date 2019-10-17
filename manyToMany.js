const sequelize = require('./sequelize')
const Sequelize = require('sequelize');
const DATA = require('./DataManyToMany');
const getRandomInt = require('./helpers');


const Users = sequelize.define('user', {
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
  
const Favorites = sequelize.define('favorites', {
    favoritesId: {
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

  const Cars = sequelize.define('cars', {
    carId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      make: Sequelize.STRING
  })
  
  Users.belongsToMany(Cars, {
    through: 'favorites',
    sourceKey: 'userId',
    foreignKey: 'userId'
  });
  Cars.belongsToMany(Users, {
    through: 'favorites',
    sourceKey: 'carId',
    foreignKey: 'carId'
  });


const intiDataBase = async () => {
    await sequelize.sync({force: true});
}

const run = async () => {
    const max = 3;
    await intiDataBase();
    console.log('asdds')
    await Promise.all( DATA.users.map( async elem=> 
         await Users.create({...elem})
    ))

    await Promise.all( DATA.cars.map( async elem => 
        await Cars.create({...elem})
   ))

   for( let i = 0 ; i < 2 ; i++ ){
       await Favorites.create({
           userId: getRandomInt(1 , max),
           carId: getRandomInt(1, max)
       })
   }

   const car = await Users.findAll({
       include: [{
        model: Cars,
        through: {
            attributes: ['carId'],
          }
        //attributes: ['make'],
        }],
        raw: false
   });

   const favorites = await Favorites.findAll({
        where:{
            userId:2
        },
        raw: true
    });

   console.log(car);
   console.log(favorites);    
} 
  
run();

