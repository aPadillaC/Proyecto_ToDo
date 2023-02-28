const {Task} = require('../dataBase/models/task');


class tasksController {

    //1 - crear un nuevo task
    //localhost:4000/tasks/createTask
    createTask = (req, res) => {

        const {title, description} = req.body;

        if(!title || !description){
            res.status(400).json("Campos vacíos");
        }
 
        Task.bulkCreate([
        { title, description}
        ]).then(() => {
        return Task.findAll();
        }).then((tasks) => {
        res.status(200).json(tasks);
        }).catch((error) => res.status(400).json(error));
        
    }



    //2 - muestra todos los task
    //localhost:4000/task/createTask
    allTask = (req, res) => {

      Task.findAll().then(tasks => {
            res.json(tasks)});       
    }



    //3 - actualiza un task
    //localhost:4000/task/upDateTask/:id
    upDateTask = (req, res) => {

        const {title, description} = req.body;
        const {id} = req.params;

        Task.findByPk(id).then((elem) => {
            
            if(elem){
            elem.update({
              title,
              description 
            }).then((task) => {
                res.status(200).json(task);
            });
            }
            else{
                res.status(400).json("Error al modificar");
            }
          });

    }



    //4 - muestra un solo task
    //localhost:4000/task/showOneTask/:id
    showOneTask = (req, res) => {

        const {id} = req.params;
          
        Task.findByPk(id).then((elem) => elem).then((task) => {
        task ?  res.status(200).json(task) :
        res.status(400).json("Tarea no existe");
        });    
       
    }



    //5 - borrar un task
    //localhost:4000/tasks/deleteTask/:id
    deleteTask = (req, res) => {

        const {id} = req.params;

        Task.findByPk(id).then((elem) => {
            
            if(elem){
                elem.destroy();
                res.status(200).json("Tarea eliminada correctamente");
            }
            else{
                res.status(400).json("Error");
            }
        })
            
                    
    }


    //6 - marchar como realizado un task
    //localhost:4000/tasks/madeTask/:id
    madeTask = (req, res) => {

        const {id} = req.params;

        Task.findByPk(id).then((elem) => {
            
            if(elem){
            elem.update({
              status: true
            }).then((task) => {
                res.status(200).json(task);
            });
            }
            else{
                res.status(400).json("Error al modificar");
            }
          });

    }
}


module.exports = new tasksController();