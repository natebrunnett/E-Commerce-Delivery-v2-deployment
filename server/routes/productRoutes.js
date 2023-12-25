const express     = require('express'),
    router        = express.Router(),
    controller    = require('../controllers/productController.js');

//findAllReturn 
router.get('/', controller.findAllReturn);


module.exports = router;