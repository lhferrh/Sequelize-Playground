const sequelize = require('./sequelize')
const Sequelize = require('sequelize');
const DATA = require('./DataManyToMany');
const getRandomInt = require('./helpers');


function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const includeArray = (myArray, obj) => {
  if(myArray.some(e => arraysEqual(e, obj))){ 
    return true;
  }
    return false;
}


/*
 1- Many users have many favorites cars and many cars are favorites of many users 
 2- One user posted many cars and one car was posted by one user
*/
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
      userId:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      make: Sequelize.STRING
  })
  

 // One user posted many cars
 Users.hasMany(Cars, {
    foreignKey: 'userId',
    constraints: true,
    delete: 'CASCADE'
  })

  // One car was posteed by one user
  Cars.belongsTo(Users, {
    foreignKey: 'userId',
    constraints: true,
  });

  // Many users haa many cars
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

    await Promise.all( DATA.users.map( async elem=> 
         Users.create({...elem})
    ))

    await Promise.all( DATA.cars.map( async (elem, index) => 
        Cars.create({...elem, "userId": 3-index})
   ))

   let user = 0;
   let car = 0;

   const combinations = [];
   for( let i = 0 ; i < 5 ; i++ ){
     do{
        car = getRandomInt(1 , max);
        user = getRandomInt(1, max);
     } while( includeArray(combinations, [user,car]));
      combinations.push([user,car]);
       await Favorites.create({
           userId: user,
           carId: car
       })
   }

   
   console.log('Favorite cars for user 1')
   const cars = await Users.findAll({
       where: {
         userId: 1
       },
       include: [{
        model: Cars,
        through: {
            attributes: ['carId'],
          }
        //attributes: ['make'],
        }],
      raw: true
   });

   console.log(cars);

   
    console.log('Cars posted by user 1')
    const carsPosted = await Cars.findAll({
         include: {
           model: Users,
           where: {
             userId: 1
           }
         },
         raw: true
     });

     console.log(carsPosted);
    
    
} 
  
run();

