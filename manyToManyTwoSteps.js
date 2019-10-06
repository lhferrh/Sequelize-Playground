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
    userId: Sequelize.INTEGER,
    carId: Sequelize.INTEGER, 
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
  
  Users.hasMany(Favorites, {
    foreignKey: 'userId',
    constraints: true,
    delete: 'CASCADE'
  })

  Favorites.belongsTo(Users, {
    foreignKey: 'userId',
    constraints: true,
  });

  Cars.hasMany(Favorites, {
    foreignKey: 'carId',
    constraints: true,
    delete: 'CASCADE'
  })

  Favorites.belongsTo(Cars, {
    foreignKey: 'carId',
    constraints: true,
  });


const intiDataBase = async () => {
    await sequelize.sync({force: true});
}

const run = async () => {
    const max = 3;
    await intiDataBase();

    await Promise.all( DATA.users.map( async elem=> 
         Users.create({...elem})
    ))

    await Promise.all( DATA.cars.map( async elem => 
        Cars.create({...elem})
   ))

   for( let i = 0 ; i < 5 ; i++ ){
       await Favorites.create({
           userId: getRandomInt(1 , max),
           carId: getRandomInt(1, max)
       })
   }


   const users = await Users.findAll({
       include: {
            model: Favorites,
            attributes: [ 'userId', 'carId'],
            //separate:true
        },
    raw: true
   });
   console.log('Favorites cars for all users')
   console.log(users);

   

   const cars = await Cars.findAll({
        include: {
        model: Favorites,
        attributes: [ 'userId', 'carId'],
        },
        raw: true
    });

    
    console.log('Users wiht its favorites cars')
    console.log(cars);


} 
  
run();

