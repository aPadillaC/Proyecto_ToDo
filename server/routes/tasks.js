var express = require('express');
const tasksController = require('../controllers/tasksController');
var router = express.Router();


// ruta base localhost:4000/tasks/

//1 - crear un nuevo task
// //localhost:4000/tasks/createTask
router.post('/createTask', tasksController.createTask);


//2 - muestra todos los task
// //localhost:4000/tasks/allTask
router.get('/allTask', tasksController.allTask);


//3 - actualiza un task
// //localhost:4000/tasks/upDateTask/:id
router.put('/upDateTask/:id', tasksController.upDateTask);


//4 - muestra un solo task
// //localhost:4000/tasks/showOneTask/:id
router.get('/showOneTask/:id', tasksController.showOneTask);


//5 - borrar un task
// //localhost:4000/tasks/deleteTask/:id
router.delete('/deleteTask/:id', tasksController.deleteTask);


//6 - marchar como realizado un task
// //localhost:4000/tasks/madeTask/:id
router.put('/madeTask/:id', tasksController.madeTask);


module.exports = router;