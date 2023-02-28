const Sequelize = require('sequelize');
const env = process.env.NODE_ENV;

// const sequelize = new Sequelize({
//   // The `host` parameter is required for other databases
//   // host: 'localhost'
  
//   dialect: 'sqlite',
//   storage: './toDo.sqlite'
// });

let sequelize = "";

if(!env){
  sequelize = new Sequelize({
  // The `host` parameter is required for other databases
  // host: 'localhost'
  
  dialect: 'sqlite',
  storage: './toDo.sqlite'
});
}
else{
  sequelize = new Sequelize({
  // The `host` parameter is required for other databases
  // host: 'localhost'
  
  dialect: 'sqlite',
  storage: './test.sqlite'
});
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;