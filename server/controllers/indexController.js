const {Task} = require('../dataBase/models/task');


class indexController {

    prueba = (req, res) => {

        const{title, description} = req.body;

        
        Task.bulkCreate([
        { title, description}
        ]).then(() => {
        return Task.findAll();
        }).then((tasks) => {
        res.status(200).json(tasks);
        }).catch((error) => res.status(400).json(error));
    
    }


    leerNotas = (req, res) => {

      Task.findAll().then(tasks => {
            console.log(tasks);
            res.json(tasks) });       
    }


    select = (req, res) => {

        const {title, description} = req.body;
        const {id} = req.params;

        Task.findByPk(id).then((elem) => {
            elem.update({
              title,
              description
            }).then((task) => {
              res.json(task);
            });
          });

    }
}


module.exports = new indexController();