const router = require("express").Router();
const CartController = require("../controllers/cart");
const authmw = require("../middleware/authMiddleware");

router.post('/add-to-cart', authmw.authMiddleware , CartController.addItemToCart);

router.get('/cart2',CartController.getCart);

module.exports = router;
