const express     = require('express'),
    router        = express.Router(),
    controller    = require('../controllers/userController.js');

//findAll
router.get('/', controller.findAllUsers);

//add, needs update
router.post('/add', controller.addUser);

//remove
router.post('/remove', controller.delete);

//login
router.post('/login', controller.login);

//verifyToken
router.post('/verifyToken', controller.verifyToken);

//addItemToCart
router.post('/update', controller.addItemToCart);

//removeItemFromCart
router.post('/deleteCartItem', controller.removeItemFromCart);

//getCart
router.post('/getCart', controller.getCart);

//magicLink Login
router.post('/enter', controller.loginWithMagicLink);

module.exports = router;