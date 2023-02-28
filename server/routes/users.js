var express = require('express');
var router = express.Router();


// ruta base localhost:4000/users/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
