var express = require('express');
const indexController = require('../controllers/indexController');
var router = express.Router();



router.post('/', indexController.prueba);

router.get('/', indexController.leerNotas);

router.put('/seleccionar/:id', indexController.select);



module.exports = router;
